#!/usr/bin/env node

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { promisify } from "node:util";
import { WebSocketConnection } from "../node_modules/@elevenlabs/client/dist/utils/WebSocketConnection.js";

const execFileAsync = promisify(execFile);
const root = resolve(import.meta.dirname, "..");
const origin = "http://localhost:3000";
const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

if (!apiKey) throw new Error("ELEVENLABS_API_KEY est absent.");

const project = JSON.parse(
  await readFile(resolve(root, "config/elevenlabs-agent.json"), "utf8"),
);
const apiBase = new URL(project.api_base_url ?? "https://api.elevenlabs.io");
if (
  apiBase.protocol !== "https:" ||
  apiBase.hostname !== "api.elevenlabs.io" ||
  apiBase.pathname !== "/"
) {
  throw new Error("config.api_base_url doit cibler la racine officielle api.elevenlabs.io.");
}

const agentId = process.env.ELEVENLABS_AGENT_ID?.trim() || project.agent_id;
if (!/^agent_[a-z0-9]+$/u.test(agentId ?? "")) throw new Error("agent_id invalide.");

const commandArguments = process.argv.slice(2);
const languageArguments = commandArguments.filter((argument) =>
  argument.startsWith("--language="),
);
const unsupportedArguments = commandArguments.filter((argument) =>
  !argument.startsWith("--language="),
);
if (unsupportedArguments.length > 0 || languageArguments.length > 1) {
  throw new Error("Usage: node scripts/benchmark-live-audio.mjs [--language=fr|nl|en]");
}
const selectedLanguage = languageArguments[0]?.slice("--language=".length) ?? null;
if (selectedLanguage !== null && !["fr", "nl", "en"].includes(selectedLanguage)) {
  throw new Error("--language doit valoir fr, nl ou en.");
}
const sessionLanguage = selectedLanguage ?? "mixed";

const latencyMaximumMilliseconds = Number(project.latency_sla?.maximum_ms);
const minimumMeasuredTurns = selectedLanguage
  ? 2
  : Math.max(6, Number(project.latency_sla?.minimum_measured_turns) || 0);
if (!Number.isFinite(latencyMaximumMilliseconds) || latencyMaximumMilliseconds <= 0) {
  throw new Error("config.latency_sla.maximum_ms doit être un nombre strictement positif.");
}

const timestamp = new Date().toISOString().replace(/[:.]/gu, "-");
const outputDirectory = resolve(
  root,
  "remote-validation",
  "live-audio",
  selectedLanguage ? `${timestamp}-${selectedLanguage}` : timestamp,
);
const inputDirectory = resolve(outputDirectory, "input-audio");
const responseDirectory = resolve(outputDirectory, "agent-audio");
await Promise.all([
  mkdir(inputDirectory, { recursive: true }),
  mkdir(responseDirectory, { recursive: true }),
]);

const allInputTurns = [
  {
    id: "fr-liquids",
    language_code: "fr",
    language: "fr-FR",
    voice: "Thomas",
    text: "Puis-je emporter une bouteille de shampoing de cent cinquante millilitres dans mon bagage à main ?",
    direct_text: "Puis-je emporter une bouteille de shampoing de cent cinquante millilitres dans mon bagage à main ?",
    expected_transcript_terms: ["shampoing", ["150", "cent cinquante"], "bagage"],
  },
  {
    id: "fr-train",
    language_code: "fr",
    language: "fr-FR",
    voice: "Thomas",
    text: "Où se trouve la gare ferroviaire dans l'aéroport ?",
    direct_text: "Où se trouve la gare ferroviaire dans l'aéroport ?",
    expected_transcript_terms: ["gare", "aeroport"],
  },
  {
    id: "nl-arrival",
    language_code: "nl",
    language: "nl-NL",
    voice: "Xander",
    text: "Kunnen we in het Nederlands verdergaan? Hoe lang voor mijn vlucht moet ik op de luchthaven zijn?",
    direct_text: "Hoe lang voor mijn vlucht moet ik op de luchthaven zijn?",
    expected_transcript_terms: ["hoe lang", "vlucht", "luchthaven"],
  },
  {
    id: "nl-transport",
    language_code: "nl",
    language: "nl-NL",
    voice: "Xander",
    text: "Waar vind ik de bushaltes als ik de terminal verlaat?",
    direct_text: "Waar vind ik de bushaltes als ik de terminal verlaat?",
    expected_transcript_terms: ["bushaltes", "terminal"],
  },
  {
    id: "en-baggage",
    language_code: "en",
    language: "en-GB",
    voice: "Daniel",
    text: "Can we continue in English? What should I do if my checked suitcase is missing after landing?",
    direct_text: "I need to report a missing checked suitcase.",
    expected_transcript_terms: ["report", "missing", "suitcase"],
  },
  {
    id: "en-medical",
    language_code: "en",
    language: "en-GB",
    voice: "Daniel",
    text: "Which medical number should I call if someone becomes seriously ill inside the airport?",
    direct_text: "Which medical number should I call if someone becomes seriously ill inside the airport?",
    expected_transcript_terms: ["medical", "seriously ill", "airport"],
  },
];
const inputTurns = allInputTurns
  .filter((turn) => !selectedLanguage || turn.language_code === selectedLanguage)
  .map(({ direct_text: directText, ...turn }) => ({
    ...turn,
    text: selectedLanguage ? directText : turn.text,
  }));

const frameMilliseconds = 20;
const trailingSilenceMilliseconds = 1_600;
const responseIdleMilliseconds = 700;
const responsePlaybackMarginMilliseconds = 650;
const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function roundMilliseconds(value) {
  return Number(value.toFixed(3));
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("en");
}

function percentile(sortedValues, fraction) {
  if (sortedValues.length === 0) return null;
  const position = (sortedValues.length - 1) * fraction;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sortedValues[lowerIndex];
  const upper = sortedValues[upperIndex];
  return roundMilliseconds(lower + ((upper - lower) * (position - lowerIndex)));
}

function pcmFrameHasSignal(frame, minimumAmplitude = 32) {
  for (let offset = 0; offset + 1 < frame.length; offset += 2) {
    if (Math.abs(frame.readInt16LE(offset)) > minimumAmplitude) return true;
  }
  return false;
}

function audioDurationMilliseconds(byteLength, format) {
  const bytesPerSample = format.format === "pcm" ? 2 : 1;
  return (byteLength / (format.sampleRate * bytesPerSample)) * 1_000;
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

function safeEvent(event, startedAt) {
  const result = {
    at_ms: Date.now() - startedAt,
    type: event.type ?? "unknown",
  };
  const payload =
    event.agent_response_event ??
    event.audio_event ??
    event.user_transcription_event ??
    event.agent_tool_response ??
    event.agent_tool_response_full_payload ??
    null;
  if (payload?.event_id !== undefined) result.event_id = payload.event_id;
  if (payload?.tool_name) result.tool_name = payload.tool_name;
  if (event.type === "agent_response") {
    result.text = event.agent_response_event?.agent_response ?? "";
  }
  if (event.type === "user_transcript" || event.type === "user_transcription") {
    result.text =
      event.user_transcription_event?.user_transcript ??
      event.user_transcription_event?.user_transcription ??
      "";
  }
  if (event.type === "audio") {
    result.audio_bytes = Buffer.byteLength(
      event.audio_event?.audio_base_64 ?? "",
      "base64",
    );
  }
  return result;
}

async function api(pathname, options = {}) {
  const response = await fetch(new URL(pathname, apiBase), {
    ...options,
    headers: {
      accept: "application/json",
      origin,
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

async function signedUrl() {
  const response = await api(
    `/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
  );
  const body = await response.json();
  const url = new URL(body.signed_url);
  if (url.protocol !== "wss:" || url.hostname !== "api.elevenlabs.io") {
    throw new Error("L'URL signée sort de l'allowlist ElevenLabs.");
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
    await wait(1_250);
  }
  throw lastError;
}

async function downloadServerAudio(conversationId) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const response = await fetch(
      new URL(`/v1/convai/conversations/${conversationId}/audio`, apiBase),
      { headers: { origin, "xi-api-key": apiKey } },
    );
    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "application/octet-stream";
      const extension = contentType.includes("mpeg")
        ? "mp3"
        : contentType.includes("wav")
          ? "wav"
          : "audio";
      const bytes = Buffer.from(await response.arrayBuffer());
      const filename = `conversation-server.${extension}`;
      await writeFile(resolve(outputDirectory, filename), bytes);
      return {
        filename,
        content_type: contentType,
        bytes: bytes.length,
        sha256: sha256(bytes),
      };
    }
    if (![404, 409, 425, 429].includes(response.status) && response.status < 500) {
      return {
        error: `HTTP ${response.status}`,
        content_type: response.headers.get("content-type"),
      };
    }
    await wait(1_250);
  }
  return { error: "audio_not_ready_after_retries" };
}

async function generateInputAudio(turn, index, sampleRate) {
  const prefix = `${String(index + 1).padStart(2, "0")}-${turn.id}`;
  const aiffFilename = `${prefix}.aiff`;
  const pcmFilename = `${prefix}-${sampleRate}hz.pcm`;
  const wavFilename = `${prefix}-${sampleRate}hz.wav`;
  const aiffPath = resolve(inputDirectory, aiffFilename);
  const pcmPath = resolve(inputDirectory, pcmFilename);

  await execFileAsync("/usr/bin/say", [
    "-v",
    turn.voice,
    "-o",
    aiffPath,
    turn.text,
  ], { maxBuffer: 1_048_576 });
  await execFileAsync(process.env.FFMPEG_PATH?.trim() || "ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    aiffPath,
    "-ac",
    "1",
    "-ar",
    String(sampleRate),
    "-c:a",
    "pcm_s16le",
    "-f",
    "s16le",
    pcmPath,
  ], { maxBuffer: 4_194_304 });

  const pcm = await readFile(pcmPath);
  if (pcm.length === 0 || pcm.length % 2 !== 0) {
    throw new Error(`PCM invalide pour le tour ${turn.id}.`);
  }
  const wav = wave(pcm, sampleRate);
  await writeFile(resolve(inputDirectory, wavFilename), wav);

  return {
    ...turn,
    pcm,
    audio: {
      aiff: `input-audio/${aiffFilename}`,
      pcm: `input-audio/${pcmFilename}`,
      wav: `input-audio/${wavFilename}`,
      sample_rate_hz: sampleRate,
      channels: 1,
      sample_format: "signed 16-bit little-endian PCM",
      duration_seconds: Number((pcm.length / 2 / sampleRate).toFixed(3)),
      bytes: pcm.length,
      sha256: sha256(pcm),
    },
  };
}

function createEventCollector(connection) {
  const startedAt = Date.now();
  const events = [];
  const responses = [];
  const responseByEvent = new Map();
  const audioByEvent = new Map();
  let disconnected = null;

  connection.onMessage((event) => {
    events.push(safeEvent(event, startedAt));
    if (event.type === "ping") {
      connection.sendMessage({
        type: "pong",
        event_id: event.ping_event.event_id,
      });
      return;
    }
    if (event.type === "audio" && event.audio_event?.audio_base_64) {
      const eventId = String(event.audio_event.event_id);
      const current = audioByEvent.get(eventId) ?? {
        event_id: event.audio_event.event_id,
        first_seen_at: Date.now(),
        last_seen_at: Date.now(),
        chunks: [],
      };
      current.last_seen_at = Date.now();
      current.chunks.push(Buffer.from(event.audio_event.audio_base_64, "base64"));
      audioByEvent.set(eventId, current);
      return;
    }
    if (event.type === "agent_response") {
      const payload = event.agent_response_event;
      const eventId = String(payload.event_id);
      const existing = responseByEvent.get(eventId);
      if (existing) {
        existing.text = payload.agent_response.startsWith(existing.text)
          ? payload.agent_response
          : `${existing.text} ${payload.agent_response}`.trim();
        existing.last_seen_at = Date.now();
      } else {
        const response = {
          ordinal: responses.length + 1,
          event_id: payload.event_id,
          text: payload.agent_response,
          first_seen_at: Date.now(),
          last_seen_at: Date.now(),
        };
        responseByEvent.set(eventId, response);
        responses.push(response);
      }
    }
  });
  connection.onDisconnect((details) => {
    disconnected = details;
  });

  return {
    audioByEvent,
    events,
    responses,
    startedAt,
    get disconnected() {
      return disconnected;
    },
  };
}

async function waitForSpokenResponse({ collector, connection, afterOrdinal, label }) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (collector.disconnected) {
      throw new Error(
        `Déconnexion pendant l'attente de ${label}: ${JSON.stringify(collector.disconnected)}`,
      );
    }
    const response = collector.responses.find((entry) => entry.ordinal > afterOrdinal);
    if (!response) {
      await wait(50);
      continue;
    }
    const audio = collector.audioByEvent.get(String(response.event_id));
    if (!audio || audio.chunks.length === 0) {
      await wait(50);
      continue;
    }
    const rawBytes = audio.chunks.reduce((total, chunk) => total + chunk.length, 0);
    const playbackMilliseconds = audioDurationMilliseconds(rawBytes, connection.outputFormat);
    const settledAt = Math.max(
      audio.last_seen_at + responseIdleMilliseconds,
      audio.first_seen_at + playbackMilliseconds + responsePlaybackMarginMilliseconds,
    );
    if (Date.now() < settledAt) {
      await wait(Math.min(100, settledAt - Date.now()));
      continue;
    }
    return {
      ...response,
      audio_first_packet_received_at_epoch_ms: audio.first_seen_at,
      audio_first_packet_received_at: new Date(audio.first_seen_at).toISOString(),
      raw_audio_bytes: rawBytes,
      playback_milliseconds: roundMilliseconds(playbackMilliseconds),
    };
  }
  throw new Error(`Aucune réponse audio complète reçue pour ${label} dans le délai imparti.`);
}

async function streamAudioTurn(connection, pcm) {
  if (connection.inputFormat.format !== "pcm") {
    throw new Error(
      `Le benchmark exige une entrée PCM, format reçu: ${connection.inputFormat.format}.`,
    );
  }
  const bytesPerFrame = Math.round(
    connection.inputFormat.sampleRate * 2 * frameMilliseconds / 1_000,
  );
  if (bytesPerFrame <= 0 || bytesPerFrame % 2 !== 0) {
    throw new Error(`Taille de frame PCM invalide: ${bytesPerFrame}.`);
  }
  const speechFrames = Math.ceil(pcm.length / bytesPerFrame);
  const silenceFrames = Math.ceil(trailingSilenceMilliseconds / frameMilliseconds);
  const totalFrames = speechFrames + silenceFrames;
  const silenceFrame = Buffer.alloc(bytesPerFrame);
  const streamStartedAt = performance.now();
  let lastNonSilentChunkSentAt = null;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    let frame;
    if (frameIndex < speechFrames) {
      const start = frameIndex * bytesPerFrame;
      const source = pcm.subarray(start, Math.min(start + bytesPerFrame, pcm.length));
      frame = source.length === bytesPerFrame
        ? source
        : Buffer.concat([source, Buffer.alloc(bytesPerFrame - source.length)]);
    } else {
      frame = silenceFrame;
    }
    connection.sendMessage({ user_audio_chunk: frame.toString("base64") });
    if (frameIndex < speechFrames && pcmFrameHasSignal(frame)) {
      lastNonSilentChunkSentAt = Date.now();
    }
    const nextDeadline = streamStartedAt + ((frameIndex + 1) * frameMilliseconds);
    const remaining = nextDeadline - performance.now();
    if (remaining > 0) await wait(remaining);
  }

  if (lastNonSilentChunkSentAt === null) {
    throw new Error("Le clip d'entrée ne contient aucun chunk PCM non silencieux.");
  }

  return {
    frame_milliseconds: frameMilliseconds,
    frame_bytes: bytesPerFrame,
    speech_frames: speechFrames,
    silence_frames: silenceFrames,
    trailing_silence_milliseconds: silenceFrames * frameMilliseconds,
    expected_stream_milliseconds: totalFrames * frameMilliseconds,
    actual_stream_milliseconds: roundMilliseconds(performance.now() - streamStartedAt),
    last_non_silent_chunk_sent_at_epoch_ms: lastNonSilentChunkSentAt,
    last_non_silent_chunk_sent_at: new Date(lastNonSilentChunkSentAt).toISOString(),
  };
}

function latencyReport(transcript, maximumMilliseconds) {
  const userIndexes = transcript
    .map((turn, index) => ({ turn, index }))
    .filter(({ turn }) => turn.role === "user" && String(turn.message ?? "").trim());
  const measuredTurns = [];
  const missingMetricTurns = [];
  const nonAudioUserTurns = [];
  const transcriptFidelityFailures = [];

  for (const [userOrdinal, userEntry] of userIndexes.entries()) {
    if (userEntry.turn.source_medium !== "audio") {
      nonAudioUserTurns.push({
        user_transcript_index: userEntry.index,
        source_medium: userEntry.turn.source_medium ?? null,
        user_message: userEntry.turn.message,
      });
    }
    const endIndex = userIndexes[userOrdinal + 1]?.index ?? transcript.length;
    const agents = transcript.slice(userEntry.index + 1, endIndex)
      .map((turn, offset) => ({ turn, index: userEntry.index + 1 + offset }))
      .filter(({ turn }) => turn.role === "agent" && String(turn.message ?? "").trim());
    if (agents.length === 0) {
      missingMetricTurns.push({
        user_transcript_index: userEntry.index,
        user_message: userEntry.turn.message,
        reason: "no_spoken_agent_response",
      });
      continue;
    }
    const measuredAgent = agents.find(({ turn }) => {
      const elapsed = Number(
        turn.conversation_turn_metrics?.metrics
          ?.convai_ttf_audio_since_silence?.elapsed_time,
      );
      return Number.isFinite(elapsed) && elapsed >= 0;
    });
    if (!measuredAgent) {
      missingMetricTurns.push({
        user_transcript_index: userEntry.index,
        agent_transcript_index: agents[0].index,
        user_message: userEntry.turn.message,
        agent_message: agents[0].turn.message,
        reason: "official_metric_missing",
      });
      continue;
    }
    const elapsedSeconds = Number(
      measuredAgent.turn.conversation_turn_metrics.metrics
        .convai_ttf_audio_since_silence.elapsed_time,
    );
    const elapsedMillisecondsRaw = elapsedSeconds * 1_000;
    const benchmarkTurn = inputTurns[userOrdinal] ?? null;
    const normalizedTranscript = normalized(userEntry.turn.message);
    const missingExpectedTerms = (benchmarkTurn?.expected_transcript_terms ?? [])
      .filter((termOrAlternatives) => {
        const alternatives = Array.isArray(termOrAlternatives)
          ? termOrAlternatives
          : [termOrAlternatives];
        return !alternatives.some((term) =>
          normalizedTranscript.includes(normalized(term)),
        );
      });
    if (missingExpectedTerms.length > 0) {
      transcriptFidelityFailures.push({
        benchmark_turn_id: benchmarkTurn?.id ?? null,
        user_transcript_index: userEntry.index,
        user_message: userEntry.turn.message,
        missing_expected_terms: missingExpectedTerms,
      });
    }
    measuredTurns.push({
      benchmark_turn_id: benchmarkTurn?.id ?? null,
      user_transcript_index: userEntry.index,
      agent_transcript_index: measuredAgent.index,
      source_event_id: measuredAgent.turn.source_event_id ?? null,
      user_message: userEntry.turn.message,
      agent_message: measuredAgent.turn.message,
      source_medium: userEntry.turn.source_medium ?? null,
      elapsed_ms: roundMilliseconds(elapsedMillisecondsRaw),
      exceeded: elapsedMillisecondsRaw > maximumMilliseconds,
    });
  }

  const sorted = measuredTurns
    .map((turn) => turn.elapsed_ms)
    .sort((left, right) => left - right);
  const exceededTurns = measuredTurns.filter((turn) => turn.exceeded);
  const turnCountsMatch =
    userIndexes.length === inputTurns.length &&
    measuredTurns.length === inputTurns.length;
  return {
    metric: "convai_ttf_audio_since_silence",
    source_path: "conversation_turn_metrics.metrics.convai_ttf_audio_since_silence.elapsed_time",
    unit: "milliseconds",
    maximum_ms: maximumMilliseconds,
    minimum_required_turns: minimumMeasuredTurns,
    transmitted_audio_turns: inputTurns.length,
    server_user_turns: userIndexes.length,
    turn_counts_match: turnCountsMatch,
    count: sorted.length,
    min_ms: sorted.length > 0 ? sorted[0] : null,
    p50_ms: percentile(sorted, 0.5),
    p95_ms: percentile(sorted, 0.95),
    max_ms: sorted.length > 0 ? sorted.at(-1) : null,
    exceeded_count: exceededTurns.length,
    exceeded_turns: exceededTurns,
    non_audio_user_turn_count: nonAudioUserTurns.length,
    non_audio_user_turns: nonAudioUserTurns,
    transcript_fidelity_failure_count: transcriptFidelityFailures.length,
    transcript_fidelity_failures: transcriptFidelityFailures,
    missing_metric_count: missingMetricTurns.length,
    missing_metric_turns: missingMetricTurns,
    measured_turns: measuredTurns,
  };
}

function clientLatencyReport(benchmarkResponses) {
  const measuredTurns = benchmarkResponses.map((response) => ({
    benchmark_turn_id: response.turn_id,
    event_id: response.event_id,
    last_non_silent_chunk_sent_at: response.stream.last_non_silent_chunk_sent_at,
    first_agent_audio_packet_received_at: response.audio_first_packet_received_at,
    elapsed_ms: response.client_best_effort_latency_ms,
  }));
  const sorted = measuredTurns
    .map((turn) => turn.elapsed_ms)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  return {
    metric: "last_non_silent_input_chunk_sent_to_first_agent_audio_packet_received",
    status: "best_effort_diagnostic_only",
    acceptance_role: "not_used_for_primary_pass_fail",
    caveat: "Includes WebSocket transport, but does not necessarily represent the start of loudspeaker playback.",
    unit: "milliseconds",
    count: sorted.length,
    min_ms: sorted.length > 0 ? sorted[0] : null,
    p50_ms: percentile(sorted, 0.5),
    p95_ms: percentile(sorted, 0.95),
    max_ms: sorted.length > 0 ? sorted.at(-1) : null,
    measured_turns: measuredTurns,
  };
}

async function writeCapturedAgentAudio(collector, connection, benchmarkResponses) {
  const labels = new Map(
    benchmarkResponses.map((response) => [String(response.event_id), response.turn_id]),
  );
  const files = [];
  for (const response of collector.responses) {
    const eventId = String(response.event_id);
    const audio = collector.audioByEvent.get(eventId);
    if (!audio) continue;
    const raw = Buffer.concat(audio.chunks);
    if (raw.length === 0) continue;
    const pcm = toPcm16(raw, connection.outputFormat);
    const label = labels.get(eventId) ?? (response.ordinal === 1 ? "opening" : `event-${eventId}`);
    const filename = `${String(response.ordinal).padStart(2, "0")}-${label}.wav`;
    const wav = wave(pcm, connection.outputFormat.sampleRate);
    await writeFile(resolve(responseDirectory, filename), wav);
    files.push({
      event_id: response.event_id,
      label,
      filename: `agent-audio/${filename}`,
      bytes: wav.length,
      duration_seconds: Number((pcm.length / 2 / connection.outputFormat.sampleRate).toFixed(3)),
      sha256: sha256(wav),
    });
  }
  return files;
}

function compactTranscriptLine(value) {
  return String(value ?? "").replace(/\s+/gu, " ").trim();
}

function markdownReport(result) {
  const latency = result.latency;
  const clientLatency = result.client_latency;
  const lines = [
    "# Benchmark audio live ElevenLabs",
    "",
    `- Généré le: ${result.generated_at}`,
    `- Agent: \`${result.agent_id}\``,
    `- Conversation: \`${result.conversation_id}\``,
    `- Langue de session: \`${result.session_language}\``,
    `- Entrée: PCM mono ${result.input_format.sampleRate} Hz`,
    `- Tours audio transmis: ${result.audio_turns.length}`,
    `- Tours utilisateur reçus par le serveur: ${latency.server_user_turns}`,
    `- Tours mesurés: ${latency.count}`,
    `- Comptage exact des tours: ${latency.turn_counts_match ? "oui" : "non"}`,
    `- Verdict: **${result.passed ? "PASS" : "FAIL"}**`,
    "",
    "## Latence officielle",
    "",
    `- Métrique: \`${latency.metric}\``,
    `- SLA: ${latency.maximum_ms} ms maximum`,
    `- Min / p50 / p95 / max: ${latency.min_ms ?? "n/a"} / ${latency.p50_ms ?? "n/a"} / ${latency.p95_ms ?? "n/a"} / ${latency.max_ms ?? "n/a"} ms`,
    `- Dépassements: ${latency.exceeded_count}`,
    `- Tours non audio: ${latency.non_audio_user_turn_count}`,
    `- Transcriptions incomplètes: ${latency.transcript_fidelity_failure_count}`,
    `- Métriques manquantes: ${latency.missing_metric_count}`,
    "",
    "## Latence client best-effort",
    "",
    `- Métrique: \`${clientLatency.metric}\``,
    `- Min / p50 / p95 / max: ${clientLatency.min_ms ?? "n/a"} / ${clientLatency.p50_ms ?? "n/a"} / ${clientLatency.p95_ms ?? "n/a"} / ${clientLatency.max_ms ?? "n/a"} ms`,
    "- Cette mesure inclut le transport WebSocket mais ne correspond pas nécessairement au début de lecture par le haut-parleur.",
    "- Elle sert au diagnostic uniquement. Le verdict principal repose sur la métrique serveur officielle.",
    "",
    "| Tour | Dernier chunk non silencieux envoyé | Premier paquet audio agent reçu | Latence client |",
    "| --- | --- | --- | ---: |",
  ];
  for (const turn of clientLatency.measured_turns) {
    lines.push(
      `| ${turn.benchmark_turn_id} | ${turn.last_non_silent_chunk_sent_at} | ${turn.first_agent_audio_packet_received_at} | ${turn.elapsed_ms} ms |`,
    );
  }
  lines.push(
    "",
    "## Tours mesurés",
    "",
    "| Tour | Latence | SLA | Question reconnue | Réponse |",
    "| --- | ---: | --- | --- | --- |",
  );
  for (const turn of latency.measured_turns) {
    lines.push(
      `| ${turn.benchmark_turn_id ?? "n/a"} | ${turn.elapsed_ms} ms | ${turn.exceeded ? "FAIL" : "PASS"} | ${compactTranscriptLine(turn.user_message)} | ${compactTranscriptLine(turn.agent_message)} |`,
    );
  }
  if (latency.missing_metric_turns.length > 0) {
    lines.push("", "## Mesures manquantes", "");
    for (const turn of latency.missing_metric_turns) {
      lines.push(`- ${turn.reason}: ${compactTranscriptLine(turn.user_message)}`);
    }
  }
  lines.push("", "## Audio d'entrée", "");
  for (const turn of result.audio_turns) {
    lines.push(
      `- \`${turn.id}\`: ${turn.voice} (${turn.language}), \`${turn.audio.wav}\`, ${turn.audio.duration_seconds} s`,
    );
  }
  lines.push("", "## Transcription serveur", "");
  for (const turn of result.server.transcript ?? []) {
    if (!turn.message) continue;
    const role = turn.role === "agent" ? "Agent" : turn.role === "user" ? "Appelant" : turn.role;
    lines.push(`**${role}**: ${compactTranscriptLine(turn.message)}`, "");
  }
  return `${lines.join("\n")}\n`;
}

async function runBenchmark() {
  const liveSignedUrl = await signedUrl();
  const connection = await WebSocketConnection.create(
    selectedLanguage
      ? {
          signedUrl: liveSignedUrl,
          overrides: { agent: { language: selectedLanguage } },
        }
      : { signedUrl: liveSignedUrl },
  );
  if (connection.inputFormat.format !== "pcm") {
    connection.close();
    throw new Error(
      `Le benchmark exige une entrée PCM, format reçu: ${connection.inputFormat.format}.`,
    );
  }
  const collector = createEventCollector(connection);
  const generatedTurns = [];
  const benchmarkResponses = [];

  try {
    for (const [index, turn] of inputTurns.entries()) {
      generatedTurns.push(
        await generateInputAudio(turn, index, connection.inputFormat.sampleRate),
      );
    }

    const opening = await waitForSpokenResponse({
      collector,
      connection,
      afterOrdinal: 0,
      label: "le message d'accueil",
    });

    for (const turn of generatedTurns) {
      const responseOrdinalBeforeTurn = collector.responses.length;
      const sentAt = Date.now();
      const stream = await streamAudioTurn(connection, turn.pcm);
      const response = await waitForSpokenResponse({
        collector,
        connection,
        afterOrdinal: responseOrdinalBeforeTurn,
        label: turn.id,
      });
      benchmarkResponses.push({
        turn_id: turn.id,
        event_id: response.event_id,
        response_text: response.text,
        sent_at: new Date(sentAt).toISOString(),
        response_first_seen_after_send_ms: response.first_seen_at - sentAt,
        audio_first_packet_received_at: response.audio_first_packet_received_at,
        client_best_effort_latency_ms: roundMilliseconds(
          response.audio_first_packet_received_at_epoch_ms -
            stream.last_non_silent_chunk_sent_at_epoch_ms,
        ),
        response_audio_milliseconds: response.playback_milliseconds,
        stream,
      });
    }

    connection.close();
    await wait(500);
    const server = await conversationDetails(connection.conversationId);
    const latency = latencyReport(server.transcript ?? [], latencyMaximumMilliseconds);
    const asrUsage = server.metadata?.charging?.asr_usage ?? null;
    const hasRecordedAudioInput =
      Number(asrUsage?.total_transcription_calls) >= minimumMeasuredTurns &&
      Number(asrUsage?.total_audio_input_seconds) > 0;
    const clientLatency = clientLatencyReport(benchmarkResponses);
    const agentAudio = await writeCapturedAgentAudio(
      collector,
      connection,
      benchmarkResponses,
    );
    const serverAudio = await downloadServerAudio(connection.conversationId);
    const passed =
      latency.count >= minimumMeasuredTurns &&
      latency.turn_counts_match &&
      latency.exceeded_count === 0 &&
      latency.missing_metric_count === 0 &&
      latency.non_audio_user_turn_count === 0 &&
      latency.transcript_fidelity_failure_count === 0 &&
      hasRecordedAudioInput;

    return {
      generated_at: new Date().toISOString(),
      remote_configuration_writes: false,
      passed,
      agent_id: agentId,
      conversation_id: connection.conversationId,
      session_language: sessionLanguage,
      session_mode: selectedLanguage ? "public_language_override" : "mixed_multilingual",
      output_directory: outputDirectory,
      input_format: connection.inputFormat,
      output_format: connection.outputFormat,
      protocol: {
        real_audio_only: true,
        text_user_messages_sent: 0,
        input_generator: "macOS say",
        converter: "ffmpeg",
        frame_milliseconds: frameMilliseconds,
        trailing_silence_milliseconds: trailingSilenceMilliseconds,
        agent_language_override: selectedLanguage,
        required_measured_audio_turns: minimumMeasuredTurns,
        voices: {
          "fr-FR": "Thomas",
          "nl-NL": "Xander",
          "en-GB": "Daniel",
        },
      },
      opening: {
        event_id: opening.event_id,
        text: opening.text,
        audio_milliseconds: opening.playback_milliseconds,
      },
      audio_turns: generatedTurns.map(({ pcm: _pcm, ...turn }) => turn),
      live_responses: benchmarkResponses,
      latency,
      audio_input_proof: {
        has_recorded_audio_input: hasRecordedAudioInput,
        asr_usage: asrUsage,
      },
      client_latency: clientLatency,
      agent_audio: agentAudio,
      server_audio: serverAudio,
      disconnect: collector.disconnected,
      sanitized_events: collector.events,
      server: {
        status: server.status,
        transcript: server.transcript,
        analysis: server.analysis,
        metadata: server.metadata,
      },
    };
  } catch (error) {
    connection.close();
    throw error;
  }
}

try {
  const result = await runBenchmark();
  await writeFile(
    resolve(outputDirectory, "benchmark.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  await writeFile(resolve(outputDirectory, "report.md"), markdownReport(result));
  const summary = {
    passed: result.passed,
    agent_id: result.agent_id,
    conversation_id: result.conversation_id,
    session_language: result.session_language,
    output_directory: result.output_directory,
    report: resolve(outputDirectory, "report.md"),
    latency: result.latency,
    client_latency: result.client_latency,
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (!result.passed) process.exitCode = 2;
} catch (error) {
  await writeFile(
    resolve(outputDirectory, "failure.json"),
    `${JSON.stringify({
      generated_at: new Date().toISOString(),
      agent_id: agentId,
      error: error instanceof Error ? error.stack : String(error),
    }, null, 2)}\n`,
  );
  throw error;
}
