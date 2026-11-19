#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { WebSocketConnection } from "../node_modules/@elevenlabs/client/dist/utils/WebSocketConnection.js";

const API_BASE = "https://api.elevenlabs.io";
const ORIGIN = "http://localhost:3000";
const root = resolve(import.meta.dirname, "..");
const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
if (!apiKey) throw new Error("ELEVENLABS_API_KEY est absent.");

const project = JSON.parse(
  await readFile(resolve(root, "config/elevenlabs-agent.json"), "utf8"),
);
const agentId = process.env.ELEVENLABS_AGENT_ID?.trim() || project.agent_id;
if (!/^agent_[a-z0-9]+$/u.test(agentId ?? "")) throw new Error("agent_id invalide.");

const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
const outputDirectory = process.env.ELEVENLABS_VALIDATION_OUTPUT_ROOT
  ? resolve(process.env.ELEVENLABS_VALIDATION_OUTPUT_ROOT)
  : resolve(root, "remote-validation", "live", timestamp);
await mkdir(outputDirectory, { recursive: true });

const fullTurns = [
  {
    id: "fr-liquids",
    text: "En français : puis-je emporter une bouteille de shampoing de 150 millilitres dans mon bagage à main ?",
  },
  {
    id: "fr-live-flight",
    text: "Mon vol SN 2607 est-il en retard, et de quelle porte part-il aujourd'hui ?",
  },
  {
    id: "switch-nl",
    text: "Kunnen we in het Nederlands verdergaan? Waar vind ik het treinstation op de luchthaven?",
  },
  {
    id: "switch-en",
    text: "Can we continue in English? What should I do if my checked suitcase is missing after landing?",
  },
  {
    id: "medical-emergency",
    text: "I am at the airport and someone next to me is conscious but very ill. Which medical number should I call now, and what should I do if the situation becomes life-threatening or the airport medical team does not answer?",
  },
  {
    id: "explicit-end",
    text: "Thank you. Please end the call now.",
  },
];
const validationMode = process.argv.includes("--resume-english")
  ? "resume-english"
  : process.argv.includes("--resume-medical-end")
    ? "resume-medical-end"
    : "full";
const turns = validationMode === "resume-english"
  ? fullTurns.slice(3)
  : validationMode === "resume-medical-end"
    ? [
        {
          id: "medical-emergency-fr",
          text: "Une personne près de moi à l'aéroport se sent très mal mais reste consciente. Quel numéro médical dois-je appeler, et que dois-je faire ?",
        },
        {
          id: "explicit-end-fr",
          text: "Merci. Veuillez terminer l'appel maintenant.",
        },
      ]
    : fullTurns;

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

function silentInputFrame(format, frameMilliseconds = 20) {
  const bytesPerSample = format.format === "pcm" ? 2 : 1;
  const sampleCount = Math.round(format.sampleRate * frameMilliseconds / 1000);
  const frame = Buffer.alloc(sampleCount * bytesPerSample);
  if (format.format === "ulaw") frame.fill(0xff);
  return frame;
}

async function api(pathname, options = {}) {
  const response = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      accept: "application/json",
      origin: ORIGIN,
      "xi-api-key": apiKey,
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${pathname}: HTTP ${response.status}: ${body.slice(0, 500)}`);
  }
  return response;
}

function remoteSummary(agent) {
  const config = agent.conversation_config ?? {};
  const prompt = config.agent?.prompt ?? {};
  const presets = config.language_presets ?? {};
  return {
    agent_id: agent.agent_id,
    version_id: agent.version_id ?? null,
    branch_id: agent.branch_id ?? null,
    llm: prompt.llm ?? null,
    base_tts: {
      model_id: config.tts?.model_id ?? null,
      voice_id: config.tts?.voice_id ?? null,
      output_format: config.tts?.agent_output_audio_format ?? null,
      stability: config.tts?.stability ?? null,
      similarity_boost: config.tts?.similarity_boost ?? null,
      speed: config.tts?.speed ?? null,
      expressive_mode: config.tts?.expressive_mode ?? null,
    },
    language_presets: Object.fromEntries(
      Object.entries(presets).map(([language, preset]) => [language, {
        language: preset.overrides?.agent?.language ?? null,
        voice_id: preset.overrides?.tts?.voice_id ?? null,
        model_id: preset.overrides?.tts?.model_id ?? null,
        stability: preset.overrides?.tts?.stability ?? null,
        similarity_boost: preset.overrides?.tts?.similarity_boost ?? null,
        speed: preset.overrides?.tts?.speed ?? null,
        first_message: preset.overrides?.agent?.first_message ?? null,
      }]),
    ),
    built_in_tools: Object.entries(prompt.built_in_tools ?? {})
      .filter(([, tool]) => tool && Object.keys(tool).length > 0)
      .map(([key, tool]) => ({
        key,
        name: tool.name ?? null,
        system_tool_type: tool.system_tool_type ?? null,
        pre_tool_speech: tool.pre_tool_speech ?? null,
      })),
    custom_tool_ids: prompt.tool_ids ?? [],
    inline_tools: Array.isArray(prompt.tools)
      ? prompt.tools
          .filter((tool) => tool.type !== "system")
          .map((tool) => tool.name ?? null)
      : [],
    knowledge_document_ids: (prompt.knowledge_base ?? []).map((entry) => entry.id),
  };
}

function sanitizeEvent(event, at) {
  const output = { at, type: event.type ?? "unknown" };
  const payload =
    event.agent_response_event ??
    event.audio_event ??
    event.agent_tool_response ??
    event.agent_tool_response_full_payload ??
    event.client_tool_call ??
    event.user_transcription_event ??
    event.conversation_initiation_metadata_event ??
    null;
  const eventId = payload?.event_id;
  if (eventId !== undefined) output.event_id = eventId;
  const toolName = payload?.tool_name;
  if (toolName) output.tool_name = toolName;
  if (event.type === "audio") {
    output.audio_bytes = Buffer.byteLength(event.audio_event?.audio_base_64 ?? "", "base64");
  }
  if (event.type === "agent_response") output.text = event.agent_response_event?.agent_response ?? "";
  if (event.type === "agent_tool_response" || event.type === "agent_tool_response_full_payload") {
    output.tool_name = payload?.tool_name ?? null;
    output.is_error = payload?.is_error ?? null;
  }
  return output;
}

function audioDurationMilliseconds(byteLength, format) {
  const bytesPerSample = format.format === "pcm" ? 2 : 1;
  return Math.ceil((byteLength / (format.sampleRate * bytesPerSample)) * 1000);
}

function decodeMuLawByte(value) {
  const byte = (~value) & 0xff;
  const sign = byte & 0x80;
  const exponent = (byte >> 4) & 0x07;
  const mantissa = byte & 0x0f;
  let sample = ((mantissa << 3) + 0x84) << exponent;
  sample -= 0x84;
  return sign ? -sample : sample;
}

function toPcm16(buffer, format) {
  if (format.format === "pcm") return buffer;
  const pcm = Buffer.allocUnsafe(buffer.length * 2);
  for (let index = 0; index < buffer.length; index += 1) {
    pcm.writeInt16LE(decodeMuLawByte(buffer[index]), index * 2);
  }
  return pcm;
}

function wave(pcm, sampleRate) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[’']/gu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("fr-BE");
}

function includesAny(value, candidates) {
  const text = normalized(value);
  return candidates.some((candidate) => text.includes(normalized(candidate)));
}

function transcriptTools(transcript) {
  return transcript.flatMap((turn) => (turn.tool_calls ?? []).map((call) => ({
    role: turn.role,
    tool_name: call.tool_name ?? call.name ?? null,
    params: call.params_as_json ?? call.parameters ?? null,
    result: call.tool_details ?? call.tool_result ?? null,
  })));
}

function evaluate({ responses, server, remote, endCallObserved }) {
  const issues = [];
  const responseText = responses.map((response) => response.text);
  const opening = responseText[0];
  const liquids = validationMode === "full" ? responseText[1] : null;
  const live = validationMode === "full" ? responseText[2] : null;
  const dutch = validationMode === "full" ? responseText[3] : null;
  const english = validationMode === "full"
    ? responseText[4]
    : validationMode === "resume-english"
      ? responseText[1]
      : null;
  const medical = validationMode === "full"
    ? responseText[5]
    : validationMode === "resume-english"
      ? responseText[2]
      : responseText[1];
  const tools = transcriptTools(server.transcript ?? []);
  const toolNames = tools.map((tool) => tool.tool_name).filter(Boolean);
  const voiceIds = (server.metadata?.charging?.tts_usage?.per_voice_usage ?? [])
    .map((usage) => usage.voice_id);

  const check = (pass, type, evidence) => {
    if (!pass) issues.push({ type, evidence });
  };

  check(
    includesAny(opening, ["bonjour"]) &&
      includesAny(opening, ["welkom"]) &&
      includesAny(opening, ["hello"]) &&
      includesAny(opening, ["Brussels Airport"]),
    "opening_not_trilingual_or_incomplete",
    opening ?? null,
  );
  if (validationMode === "full") {
    check(
      includesAny(liquids, ["100 millilitres", "cent millilitres", "100 ml"]) &&
        includesAny(liquids, ["un litre", "1 litre", "one litre"]),
      "liquids_rule_incomplete",
      liquids ?? null,
    );
    check(
      includesAny(live, ["pas le statut en direct", "pas d'accès aux informations en temps réel", "pas acces aux informations en temps reel"]) &&
        includesAny(live, ["écrans", "ecrans"]) &&
        includesAny(live, ["application Brussels Airport", "app Brussels Airport", "compagnie"]),
      "live_status_guardrail_missing",
      live ?? null,
    );
    check(
      includesAny(dutch, ["treinstation", "station"]) &&
        includesAny(dutch, ["niveau min één", "niveau -1", "level -1", "onder de terminal"]),
      "dutch_answer_missing_or_wrong",
      dutch ?? null,
    );
  }
  if (validationMode !== "resume-medical-end") {
    check(
      includesAny(english, ["baggage handler", "handling agent", "baggage desk", "airline", "handler's desk"]) &&
        includesAny(english, ["belt 7", "belt 8", "carousels seven", "carousels eight", "baggage hall", "before leaving"]),
      "english_answer_missing_or_wrong",
      english ?? null,
    );
  }
  check(
    includesAny(medical, ["02 753 63 63", "zero two seven five three six three six three", "two seven five three six three six three", "zero deux sept cinq trois six trois six trois"]) &&
      includesAny(medical, ["112", "one one two", "cent douze"]) &&
      includesAny(medical, ["exact location", "stay with", "remain with", "endroit exact", "restez auprès", "restez aupres"]),
    "medical_emergency_guidance_incomplete",
    medical ?? null,
  );
  if (validationMode !== "resume-medical-end") {
    check(
      toolNames.filter((name) => name === "language_detection").length >= (validationMode === "full" ? 2 : 1),
      validationMode === "full" ? "language_detection_not_observed_twice" : "english_language_detection_not_observed",
      tools,
    );
  }
  check(
    endCallObserved || toolNames.includes("end_call"),
    "end_call_not_observed",
    tools,
  );
  for (const language of validationMode === "full"
    ? ["fr", "nl", "en"]
    : validationMode === "resume-english"
      ? ["en"]
      : ["fr"]) {
    const expectedVoice = project.voices?.[language]?.id;
    check(
      expectedVoice && voiceIds.includes(expectedVoice),
      `expected_${language}_voice_not_billed`,
      { expected: expectedVoice, used: voiceIds },
    );
  }
  check(
    remote.custom_tool_ids.length === 0 && remote.inline_tools.length === 0,
    "unexpected_custom_tools_configured",
    { tool_ids: remote.custom_tool_ids, inline_tools: remote.inline_tools },
  );
  check(
    remote.base_tts.model_id === project.model,
    "tts_model_mismatch",
    { expected: project.model, actual: remote.base_tts.model_id },
  );

  return {
    passed: issues.length === 0,
    issues,
    observed_tool_names: toolNames,
    observed_voice_ids: voiceIds,
    language_detection_usage: server.metadata?.features_usage?.language_detection ?? null,
    multivoice_usage: server.metadata?.features_usage?.multivoice ?? null,
  };
}

async function signedUrl() {
  const response = await api(
    `/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
  );
  const body = await response.json();
  const url = new URL(body.signed_url);
  if (url.protocol !== "wss:" || url.hostname !== "api.elevenlabs.io") {
    throw new Error("L’URL signée sort de l’allowlist ElevenLabs.");
  }
  return body.signed_url;
}

async function conversationDetails(conversationId) {
  let lastError;
  for (let attempt = 0; attempt < 72; attempt += 1) {
    try {
      const response = await api(`/v1/convai/conversations/${conversationId}`);
      const body = await response.json();
      if (body.status === "done") return body;
      lastError = new Error(`Conversation encore en traitement: ${body.status}.`);
    } catch (error) {
      lastError = error;
    }
    await wait(1250);
  }
  throw lastError;
}

async function downloadServerAudio(conversationId) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const response = await fetch(
      `${API_BASE}/v1/convai/conversations/${conversationId}/audio`,
      { headers: { origin: ORIGIN, "xi-api-key": apiKey } },
    );
    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "application/octet-stream";
      const extension = contentType.includes("mpeg") ? "mp3" : contentType.includes("wav") ? "wav" : "audio";
      const bytes = Buffer.from(await response.arrayBuffer());
      const filename = `conversation-server.${extension}`;
      await writeFile(resolve(outputDirectory, filename), bytes);
      return {
        filename,
        content_type: contentType,
        bytes: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      };
    }
    if (![404, 409, 425, 429].includes(response.status) && response.status < 500) {
      return { error: `HTTP ${response.status}`, content_type: response.headers.get("content-type") };
    }
    await wait(1250);
  }
  return { error: "audio_not_ready_after_retries" };
}

async function runLiveConversation() {
  const remoteAgent = await (await api(`/v1/convai/agents/${encodeURIComponent(agentId)}`)).json();
  const remote = remoteSummary(remoteAgent);
  const connection = await WebSocketConnection.create({ signedUrl: await signedUrl() });
  const startedAt = Date.now();
  const events = [];
  const responses = [];
  const responseIndexByEvent = new Map();
  const audioByEvent = new Map();
  const audioEventOrder = [];
  const settleTimers = new Map();
  const advanceTimers = new Map();
  const advancedResponseEvents = new Set();
  const outgoingTurnEvents = [];
  let nextTurnIndex = 0;
  let endCallObserved = false;
  let disconnected = null;
  let finishTimer;
  const inputFrameMilliseconds = 20;
  const inputFrame = silentInputFrame(connection.inputFormat, inputFrameMilliseconds);
  const encodedInputFrame = inputFrame.toString("base64");
  let inputFramesSent = 0;
  let inputStreamStopped = false;
  const inputStreamTimer = setInterval(() => {
    if (inputStreamStopped || disconnected) return;
    try {
      connection.sendMessage({ user_audio_chunk: encodedInputFrame });
      inputFramesSent += 1;
    } catch {
      inputStreamStopped = true;
      clearInterval(inputStreamTimer);
    }
  }, inputFrameMilliseconds);

  const stopInputStream = () => {
    inputStreamStopped = true;
    clearInterval(inputStreamTimer);
  };

  const finished = new Promise((resolveFinished, rejectFinished) => {
    const overallTimeout = setTimeout(() => {
      stopInputStream();
      connection.close();
      rejectFinished(new Error(
        `Délai dépassé: ${nextTurnIndex}/${turns.length} tours envoyés, ${responses.length} réponses reçues.`,
      ));
    }, 360_000);

    const succeed = () => {
      clearTimeout(overallTimeout);
      clearTimeout(finishTimer);
      for (const timer of settleTimers.values()) clearTimeout(timer);
      for (const timer of advanceTimers.values()) clearTimeout(timer);
      stopInputStream();
      resolveFinished();
    };

    const sendNextTurn = () => {
      if (nextTurnIndex >= turns.length) return;
      const turn = turns[nextTurnIndex];
      nextTurnIndex += 1;
      outgoingTurnEvents.push({
        id: turn.id,
        text: turn.text,
        sent_at_milliseconds: Date.now() - startedAt,
      });
      connection.sendMessage({ type: "user_message", text: turn.text });
    };

    const settleResponse = (eventId) => {
      if (advancedResponseEvents.has(eventId)) return;
      clearTimeout(settleTimers.get(eventId));
      clearTimeout(advanceTimers.get(eventId));
      const timer = setTimeout(() => {
        settleTimers.delete(eventId);
        const responseIndex = responseIndexByEvent.get(eventId);
        if (responseIndex === undefined) return;
        const chunks = audioByEvent.get(eventId) ?? [];
        const byteLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
        const response = responses[responseIndex];
        const spokenMilliseconds = byteLength > 0
          ? audioDurationMilliseconds(byteLength, connection.outputFormat)
          : Math.max(1_500, Math.ceil(response.text.length / 15) * 1_000);
        const elapsed = Date.now() - response.first_seen_at;
        const remaining = Math.max(1_200, spokenMilliseconds + 2_000 - elapsed);
        const advanceTimer = setTimeout(() => {
          advanceTimers.delete(eventId);
          if (advancedResponseEvents.has(eventId)) return;
          advancedResponseEvents.add(eventId);
          if (nextTurnIndex < turns.length) {
            sendNextTurn();
          } else if (!endCallObserved) {
            finishTimer = setTimeout(() => {
              connection.close();
              rejectFinished(new Error("L’outil end_call n’a pas terminé la session après la demande explicite."));
            }, 25_000);
          }
        }, remaining);
        advanceTimers.set(eventId, advanceTimer);
      }, 650);
      settleTimers.set(eventId, timer);
    };

    connection.onMessage((event) => {
      events.push(sanitizeEvent(event, Date.now() - startedAt));
      if (event.type === "ping") {
        connection.sendMessage({ type: "pong", event_id: event.ping_event.event_id });
        return;
      }
      if (event.type === "audio" && event.audio_event?.audio_base_64) {
        const eventId = event.audio_event.event_id;
        if (!audioByEvent.has(eventId)) audioEventOrder.push(eventId);
        const chunks = audioByEvent.get(eventId) ?? [];
        chunks.push(Buffer.from(event.audio_event.audio_base_64, "base64"));
        audioByEvent.set(eventId, chunks);
        if (responseIndexByEvent.has(eventId)) settleResponse(eventId);
        return;
      }
      if (event.type === "agent_response") {
        const payload = event.agent_response_event;
        const existingIndex = responseIndexByEvent.get(payload.event_id);
        if (existingIndex === undefined) {
          responseIndexByEvent.set(payload.event_id, responses.length);
          responses.push({
            event_id: payload.event_id,
            text: payload.agent_response,
            first_seen_at: Date.now(),
          });
        } else {
          const existing = responses[existingIndex];
          existing.text = payload.agent_response.startsWith(existing.text)
            ? payload.agent_response
            : `${existing.text} ${payload.agent_response}`.trim();
        }
        settleResponse(payload.event_id);
        return;
      }
      const toolPayload = event.agent_tool_response ?? event.agent_tool_response_full_payload;
      if (
        (event.type === "agent_tool_response" || event.type === "agent_tool_response_full_payload") &&
        toolPayload?.tool_name === "end_call"
      ) {
        endCallObserved = true;
        finishTimer = setTimeout(succeed, 4_000);
      }
    });

    connection.onDisconnect((details) => {
      disconnected = details;
      stopInputStream();
      if (nextTurnIndex >= turns.length) {
        succeed();
      } else {
        clearTimeout(overallTimeout);
        rejectFinished(new Error(`Déconnexion prématurée: ${JSON.stringify(details)}`));
      }
    });
  });

  await finished;
  if (!disconnected) connection.close();

  const server = await conversationDetails(connection.conversationId);
  const audioFiles = [];
  const combinedPcm = [];
  for (const [index, eventId] of audioEventOrder.entries()) {
    const raw = Buffer.concat(audioByEvent.get(eventId) ?? []);
    if (raw.length === 0) continue;
    const pcm = toPcm16(raw, connection.outputFormat);
    const filename = `response-${String(index + 1).padStart(2, "0")}-event-${eventId}.wav`;
    const wav = wave(pcm, connection.outputFormat.sampleRate);
    await writeFile(resolve(outputDirectory, filename), wav);
    audioFiles.push({
      event_id: eventId,
      filename,
      raw_bytes: raw.length,
      wav_bytes: wav.length,
      duration_seconds: Number((pcm.length / 2 / connection.outputFormat.sampleRate).toFixed(3)),
      sha256: createHash("sha256").update(wav).digest("hex"),
    });
    combinedPcm.push(pcm, Buffer.alloc(connection.outputFormat.sampleRate));
  }
  const combinedWave = wave(Buffer.concat(combinedPcm), connection.outputFormat.sampleRate);
  await writeFile(resolve(outputDirectory, "agent-responses-complete.wav"), combinedWave);
  const serverAudio = await downloadServerAudio(connection.conversationId);
  const quality = evaluate({ responses, server, remote, endCallObserved });
  return {
    generated_at: new Date().toISOString(),
    validation_mode: validationMode,
    read_only: true,
    origin: ORIGIN,
    output_directory: outputDirectory,
    agent: remote,
    conversation: {
      conversation_id: connection.conversationId,
      input_format: connection.inputFormat,
      output_format: connection.outputFormat,
      continuous_input_stream: {
        codec: connection.inputFormat.format,
        sample_rate_hz: connection.inputFormat.sampleRate,
        frame_milliseconds: inputFrameMilliseconds,
        frame_bytes: inputFrame.length,
        frames_sent: inputFramesSent,
        total_audio_seconds: Number((inputFramesSent * inputFrameMilliseconds / 1000).toFixed(3)),
      },
      disconnected,
      end_call_observed_live: endCallObserved,
      sent_turns: turns,
      sent_turn_events: outgoingTurnEvents,
      live_responses: responses.map(({ first_seen_at: _ignored, ...response }) => response),
      sanitized_events: events,
      server: {
        status: server.status,
        transcript: server.transcript,
        analysis: server.analysis,
        metadata: server.metadata,
      },
    },
    audio: {
      per_response: audioFiles,
      complete_wav: {
        filename: "agent-responses-complete.wav",
        bytes: combinedWave.length,
        sha256: createHash("sha256").update(combinedWave).digest("hex"),
      },
      server_audio: serverAudio,
    },
    quality,
  };
}

function markdownReport(result) {
  const lines = [
    "# Validation live ElevenLabs — Brussels Airport Voice",
    "",
    `- Générée le : ${result.generated_at}`,
    `- Agent : \`${result.agent.agent_id}\``,
    `- Conversation : \`${result.conversation.conversation_id}\``,
    `- Mode : lecture seule`,
    `- Scénario : \`${result.validation_mode}\``,
    `- Verdict automatique : **${result.quality.passed ? "PASS" : "FAIL"}**`,
    `- Audio WebSocket complet : \`${result.audio.complete_wav.filename}\``,
    `- Audio serveur : \`${result.audio.server_audio.filename ?? result.audio.server_audio.error}\``,
    "",
    "## Configuration distante observée",
    "",
    `- LLM : \`${result.agent.llm}\``,
    `- TTS : \`${result.agent.base_tts.model_id}\`, stabilité ${result.agent.base_tts.stability}, vitesse ${result.agent.base_tts.speed}`,
    `- Voix FR : \`${result.agent.language_presets.fr?.voice_id}\``,
    `- Voix NL : \`${result.agent.language_presets.nl?.voice_id}\``,
    `- Voix EN : \`${result.agent.language_presets.en?.voice_id}\``,
    `- Outils configurés : ${result.agent.built_in_tools.map((tool) => `\`${tool.name}\``).join(", ")}`,
    `- Outils custom : ${result.agent.custom_tool_ids.length + result.agent.inline_tools.length}`,
    "",
    "## Transcription serveur",
    "",
  ];
  for (const turn of result.conversation.server.transcript ?? []) {
    const role = turn.role === "agent" ? "Agent" : turn.role === "user" ? "Appelant" : turn.role;
    if (turn.message) lines.push(`**${role}** — ${turn.message}`);
    for (const call of turn.tool_calls ?? []) {
      lines.push(`**Outil** — \`${call.tool_name ?? call.name}\` ${call.params_as_json ?? ""}`.trim());
    }
    lines.push("");
  }
  lines.push("## Contrôles", "");
  lines.push(`- Voix réellement facturées : ${result.quality.observed_voice_ids.map((id) => `\`${id}\``).join(", ")}`);
  lines.push(`- Outils réellement observés : ${result.quality.observed_tool_names.map((name) => `\`${name}\``).join(", ")}`);
  lines.push(`- Fichiers audio de réponse : ${result.audio.per_response.length}`);
  if (result.quality.issues.length === 0) {
    lines.push("- Aucun écart automatique détecté.");
  } else {
    for (const issue of result.quality.issues) {
      lines.push(`- **${issue.type}** — ${JSON.stringify(issue.evidence)}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

try {
  const result = await runLiveConversation();
  await writeFile(resolve(outputDirectory, "session.json"), `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(resolve(outputDirectory, "transcript.md"), markdownReport(result));
  await mkdir(resolve(root, "remote-validation", "live"), { recursive: true });
  await writeFile(
    resolve(root, "remote-validation", "live", "latest.json"),
    `${JSON.stringify({
      generated_at: result.generated_at,
      output_directory: outputDirectory,
      conversation_id: result.conversation.conversation_id,
      passed: result.quality.passed,
      issues: result.quality.issues,
    }, null, 2)}\n`,
  );
  process.stdout.write(`${JSON.stringify({
    conversation_id: result.conversation.conversation_id,
    output_directory: outputDirectory,
    transcript: resolve(outputDirectory, "transcript.md"),
    complete_wav: resolve(outputDirectory, result.audio.complete_wav.filename),
    server_audio: result.audio.server_audio,
    quality: result.quality,
  }, null, 2)}\n`);
  if (!result.quality.passed) process.exitCode = 2;
} catch (error) {
  await writeFile(
    resolve(outputDirectory, "failure.json"),
    `${JSON.stringify({
      generated_at: new Date().toISOString(),
      agent_id: agentId,
      read_only: true,
      error: error instanceof Error ? error.stack : String(error),
    }, null, 2)}\n`,
  );
  throw error;
}
