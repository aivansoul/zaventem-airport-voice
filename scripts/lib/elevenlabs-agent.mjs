import crypto from "node:crypto";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

export const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const OFFICIAL_API_HOSTS = new Set([
  "api.elevenlabs.io",
  "api.us.elevenlabs.io",
  "api.eu.residency.elevenlabs.io",
  "api.in.residency.elevenlabs.io",
  "api.sg.residency.elevenlabs.io",
]);
const LANGUAGES = Object.freeze(["fr", "nl", "en"]);
const REQUIRED_OPENING =
  "Bonjour, welkom, hello — bienvenue à Brussels Airport. Comment puis-je vous aider ?";
const ID_PATTERN = /^[A-Za-z0-9_-]{10,}$/;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function projectPath(relativePath, label) {
  if (typeof relativePath !== "string" || !relativePath.trim()) {
    throw new Error(`${label}_missing`);
  }
  const absolutePath = path.resolve(PROJECT_ROOT, relativePath);
  const prefix = `${PROJECT_ROOT}${path.sep}`;
  if (absolutePath !== PROJECT_ROOT && !absolutePath.startsWith(prefix)) {
    throw new Error(`${label}_outside_project`);
  }
  return absolutePath;
}

async function readJson(filePath, label) {
  let value;
  try {
    value = JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label}_invalid_json: ${error.message}`);
  }
  return value;
}

function validateApiBase(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("api_base_url_invalid");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    !OFFICIAL_API_HOSTS.has(url.hostname)
  ) {
    throw new Error("api_base_url_must_be_official_elevenlabs_root");
  }
  return url.toString().replace(/\/$/, "");
}

function assertId(value, label, { nullable = false, prefix } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== "string" || !ID_PATTERN.test(value)) {
    throw new Error(`${label}_invalid`);
  }
  if (prefix && !value.startsWith(prefix)) throw new Error(`${label}_invalid_prefix`);
}

function validateVoiceSettings(settings) {
  if (!isObject(settings)) throw new Error("tts_settings_missing");
  const bounds = {
    stability: [0, 1],
    similarity_boost: [0, 1],
    speed: [0.7, 1.2],
    style: [0, 1],
  };
  for (const [key, [minimum, maximum]] of Object.entries(bounds)) {
    const value = settings[key];
    if (!Number.isFinite(value) || value < minimum || value > maximum) {
      throw new Error(`tts_settings_${key}_invalid`);
    }
  }
}

function validateConfig(config) {
  if (!isObject(config) || config.schema_version !== 1) {
    throw new Error("config_schema_version_unsupported");
  }
  if (typeof config.agent_name !== "string" || config.agent_name.length < 8) {
    throw new Error("agent_name_invalid");
  }
  validateApiBase(config.api_base_url);
  assertId(config.agent_id, "agent_id", { nullable: true, prefix: "agent_" });
  assertId(config.knowledge_document_id, "knowledge_document_id", { nullable: true });
  if (!isObject(config.voices)) throw new Error("voices_missing");
  for (const language of LANGUAGES) {
    const voice = config.voices[language];
    if (!isObject(voice)) throw new Error(`voice_${language}_missing`);
    assertId(voice.id, `voice_${language}_id`);
  }
  if (new Set(LANGUAGES.map((language) => config.voices[language].id)).size !== 3) {
    throw new Error("voice_ids_must_be_distinct");
  }
  if (!isObject(config.privacy)) throw new Error("privacy_missing");
  if (
    config.privacy.record_voice !== true ||
    config.privacy.delete_transcript_and_pii !== true ||
    config.privacy.delete_audio !== false ||
    !Number.isInteger(config.privacy.retention_days) ||
    config.privacy.retention_days < 1 ||
    config.privacy.retention_days > 730
  ) {
    throw new Error("privacy_invalid");
  }
  if (config.model !== "eleven_v3_conversational") {
    throw new Error("tts_model_must_be_eleven_v3_conversational");
  }
  validateVoiceSettings(config.tts_settings);
  if (
    !Array.isArray(config.languages) ||
    !isDeepStrictEqual([...config.languages].sort(), [...LANGUAGES].sort())
  ) {
    throw new Error("languages_must_be_fr_nl_en");
  }
  if (
    !Array.isArray(config.public_origins) ||
    config.public_origins.length === 0 ||
    config.public_origins.length > 10 ||
    config.public_origins.some(
      (hostname) =>
        typeof hostname !== "string" ||
        hostname.includes("*") ||
        hostname.includes("/") ||
        !/^(?:localhost|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?::\d{1,5})?$/i.test(
          hostname,
        ),
    )
  ) {
    throw new Error("public_origins_invalid");
  }
}

export async function loadProject(configFile = "config/elevenlabs-agent.json") {
  const configPath = projectPath(configFile, "config_file");
  const config = await readJson(configPath, "config");
  validateConfig(config);

  const promptPath = projectPath(config.prompt_file, "prompt_file");
  const firstMessagesPath = projectPath(config.first_messages_file, "first_messages_file");
  const knowledgePath = projectPath(config.knowledge_file, "knowledge_file");
  const voiceDesignPath = projectPath(config.voice_design_file, "voice_design_file");
  const [prompt, firstMessages, knowledge, voiceDesign] = await Promise.all([
    readFile(promptPath, "utf8"),
    readJson(firstMessagesPath, "first_messages"),
    readFile(knowledgePath, "utf8"),
    readJson(voiceDesignPath, "voice_design"),
  ]);

  if (!prompt.trim()) throw new Error("system_prompt_empty");
  if (!knowledge.trim()) throw new Error("knowledge_base_empty");
  if (firstMessages.opening !== REQUIRED_OPENING) {
    throw new Error("first_message_not_locked");
  }
  for (const language of LANGUAGES) {
    if (!firstMessages.languages?.[language] || !firstMessages.goodbye?.[language]) {
      throw new Error(`first_messages_${language}_incomplete`);
    }
    if (voiceDesign.candidates?.[language]?.voice_id !== config.voices[language].id) {
      throw new Error(`voice_design_${language}_does_not_match_config`);
    }
  }

  return {
    config,
    configPath,
    prompt: prompt.trim(),
    promptPath,
    firstMessages,
    firstMessagesPath,
    knowledge: knowledge.trim(),
    knowledgePath,
    voiceDesign,
    voiceDesignPath,
  };
}

function builtInTools() {
  return {
    transfer_to_agent: null,
    transfer_to_number: null,
    skip_turn: null,
    play_keypad_touch_tone: null,
    voicemail_detection: null,
    language_detection: {
      type: "system",
      name: "language_detection",
      description:
        "Brussels Airport Voice — Silent language gate. Switch only between fr, nl and en after an explicit language request or a clear complete utterance in another supported language. Call before any text in the target language, preserve the pending request, and never replay the welcome or announce the switch. Do not switch for an isolated proper name, airport term, flight number, loanword or background voice.",
      pre_tool_speech: "off",
      force_pre_tool_speech: false,
      interruption_mode: "disable_during_tool_and_turn",
      tool_call_sound: null,
      params: {
        system_tool_type: "language_detection",
        only_at_conversation_start: false,
      },
    },
    end_call: {
      type: "system",
      name: "end_call",
      description:
        "Brussels Airport Voice — Call only when the caller explicitly asks to end the call, says goodbye, or confirms nothing else is needed. Never end automatically after an emergency instruction or a request for human help. The tool call must be the only output; put one short goodbye in the active language in the message parameter and never speak another goodbye first.",
      pre_tool_speech: "off",
      force_pre_tool_speech: false,
      tool_call_sound: null,
      params: { system_tool_type: "end_call" },
    },
  };
}

function ttsConfiguration(project, language, { preset = false } = {}) {
  const { config } = project;
  const settings = config.tts_settings;
  const value = {
    model_id: config.model,
    voice_id: config.voices[language].id,
    stability: settings.stability,
    speed: settings.speed,
    similarity_boost: settings.similarity_boost,
  };
  if (!preset) {
    Object.assign(value, {
      supported_voices: [],
      expressive_mode: true,
      agent_output_audio_format: "pcm_16000",
      text_normalisation_type: "system_prompt",
      enable_phoneme_tags: false,
    });
  }
  return value;
}

function languagePresets(project) {
  return Object.fromEntries(
    LANGUAGES.map((language) => [
      language,
      {
        overrides: {
          agent: {
            first_message: project.firstMessages.languages[language],
            language,
            prompt: {
              prompt: project.prompt,
              llm: project.config.llm,
            },
          },
          tts: ttsConfiguration(project, language, { preset: true }),
        },
      },
    ]),
  );
}

export function buildAgentPayload(project, {
  knowledgeDocumentId = "__KNOWLEDGE_DOCUMENT_ID__",
} = {}) {
  if (
    knowledgeDocumentId !== "__KNOWLEDGE_DOCUMENT_ID__" &&
    !ID_PATTERN.test(knowledgeDocumentId)
  ) {
    throw new Error("knowledge_document_id_invalid_for_payload");
  }
  const { config } = project;
  const defaultClientEvents = [
    "audio",
    "interruption",
    "user_transcript",
    "agent_response",
    "agent_tool_request",
    "agent_tool_response",
    "ping",
  ];

  const payload = {
    name: config.agent_name,
    tags: ["brussels-airport", "zaventem", "prototype", "fr-nl-en"],
    platform_settings: {
      auth: {
        enable_auth: false,
        allowlist: config.public_origins.map((hostname) => ({ hostname })),
        require_origin_header: true,
        shareable_token: null,
      },
      call_limits: {
        agent_concurrency_limit: 2,
        daily_limit: 120,
        bursting_enabled: false,
      },
      privacy: {
        record_voice: config.privacy.record_voice,
        retention_days: config.privacy.retention_days,
        delete_transcript_and_pii: config.privacy.delete_transcript_and_pii,
        delete_audio: config.privacy.delete_audio,
        apply_to_existing_conversations: false,
        zero_retention_mode: config.privacy.zero_retention_mode,
      },
      overrides: {
        conversation_config_override: {
          agent: { language: true },
        },
      },
    },
    conversation_config: {
      asr: {
        provider: "scribe_realtime",
        quality: "high",
        user_input_audio_format: "pcm_16000",
        keywords: [
          "Brussels Airport",
          "Zaventem",
          "BRU",
          "BRUce",
          "Schengen",
          "Fast Lane",
          "français",
          "Nederlands",
          "English",
        ],
      },
      turn: {
        turn_model: "turn_v3",
        turn_eagerness: "eager",
        turn_timeout: 7,
        spelling_patience: "auto",
        speculative_turn: true,
        soft_timeout_config: { timeout_seconds: -1 },
      },
      tts: ttsConfiguration(project, "fr"),
      conversation: {
        max_duration_seconds: 600,
        client_events: defaultClientEvents,
        file_input: { enabled: false },
      },
      language_presets: languagePresets(project),
      vad: { background_voice_detection: false },
      agent: {
        first_message: project.firstMessages.opening,
        language: "fr",
        disable_first_message_interruptions: false,
        prompt: {
          prompt: project.prompt,
          llm: config.llm,
          temperature: 0,
          max_tokens: 180,
          ignore_default_personality: true,
          tool_ids: [],
          built_in_tools: builtInTools(),
          knowledge_base: [
            {
              type: "text",
              name: config.knowledge_document_name,
              id: knowledgeDocumentId,
              usage_mode: "prompt",
            },
          ],
          rag: {
            enabled: true,
            embedding_model: "e5_mistral_7b_instruct",
            optional_rag_enabled: false,
            max_vector_distance: 0.6,
            max_documents_length: 18000,
            max_retrieved_rag_chunks_count: 4,
            include_source_urls: false,
          },
        },
      },
    },
  };

  assertNoMixedToolPayload(payload);
  return payload;
}

export function assertNoMixedToolPayload(payload) {
  const prompt = payload?.conversation_config?.agent?.prompt;
  if (!isObject(prompt) || !Array.isArray(prompt.tool_ids)) {
    throw new Error("prompt_tool_ids_must_be_an_array");
  }
  if (Object.hasOwn(prompt, "tools")) {
    throw new Error("prompt_must_not_send_tools_with_tool_ids");
  }
  if (prompt.tool_ids.length !== 0) throw new Error("custom_tools_must_be_empty");
  return true;
}

export function knowledgeCreatePayload(project) {
  return {
    name: project.config.knowledge_document_name,
    text: project.knowledge,
  };
}

export function knowledgeUpdatePayload(project) {
  return {
    name: project.config.knowledge_document_name,
    content: project.knowledge,
  };
}

export function payloadDigest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function redactRemoteDetail(value) {
  return String(value)
    .replace(/(xi-api-key|authorization|api[_-]?key|secret|token)["'\s:=]+[^,"'\s}]+/gi, "$1=[redacted]")
    .slice(0, 700);
}

export async function apiRequest({
  project,
  apiKey,
  pathname,
  method = "GET",
  body,
  fetchImpl = globalThis.fetch,
  timeoutMs = 45_000,
}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetch_implementation_required");
  if (typeof apiKey !== "string" || apiKey.trim().length < 20) {
    throw new Error("elevenlabs_api_key_missing_or_invalid");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchImpl(new URL(pathname, `${project.config.api_base_url}/`), {
      method,
      headers: {
        "xi-api-key": apiKey.trim(),
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: "error",
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error(`elevenlabs_timeout_${method}`);
    throw new Error(`elevenlabs_network_error_${method}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }

  const responseText = await response.text();
  let responseBody = null;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }
  if (!response.ok) {
    const detail = redactRemoteDetail(
      typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody),
    );
    throw new Error(`elevenlabs_${method}_${response.status}: ${detail}`);
  }
  return responseBody;
}

export function remoteId(value, label) {
  const id = value?.id ?? value?.document_id ?? value?.agent_id ?? value;
  assertId(id, label);
  return id;
}

function comparableTts(value) {
  return {
    model_id: value?.model_id,
    voice_id: value?.voice_id,
    stability: value?.stability,
    speed: value?.speed,
    similarity_boost: value?.similarity_boost,
  };
}

function assertEqual(actual, expected, label) {
  if (!isDeepStrictEqual(actual, expected)) throw new Error(`${label}_mismatch`);
}

export function verifyAgentSnapshot(remote, expectedPayload) {
  const expected = expectedPayload.conversation_config;
  const actual = remote?.conversation_config;
  if (!isObject(actual)) throw new Error("remote_conversation_config_missing");
  assertEqual(remote.name, expectedPayload.name, "remote_agent_name");
  assertEqual(
    remote.platform_settings?.auth?.enable_auth,
    expectedPayload.platform_settings.auth.enable_auth,
    "remote_auth_enabled",
  );
  assertEqual(
    remote.platform_settings?.auth?.allowlist,
    expectedPayload.platform_settings.auth.allowlist,
    "remote_origin_allowlist",
  );
  assertEqual(
    remote.platform_settings?.auth?.require_origin_header,
    expectedPayload.platform_settings.auth.require_origin_header,
    "remote_origin_header_requirement",
  );
  assertEqual(
    remote.platform_settings?.overrides?.conversation_config_override?.agent?.language,
    true,
    "remote_language_override",
  );
  assertEqual(actual.agent?.first_message, expected.agent.first_message, "remote_first_message");
  assertEqual(actual.agent?.language, "fr", "remote_root_language");
  assertEqual(actual.agent?.prompt?.prompt, expected.agent.prompt.prompt, "remote_prompt");
  assertEqual(actual.agent?.prompt?.llm, expected.agent.prompt.llm, "remote_llm");
  assertEqual(actual.agent?.prompt?.tool_ids ?? [], [], "remote_custom_tool_ids");

  const expandedTools = Array.isArray(actual.agent?.prompt?.tools)
    ? actual.agent.prompt.tools
    : [];
  const nonSystemTools = expandedTools.filter((tool) => tool?.type !== "system");
  assertEqual(nonSystemTools.map((tool) => tool?.name), [], "remote_non_system_tools");

  const builtIns = actual.agent?.prompt?.built_in_tools ?? {};
  if (!builtIns.language_detection || !builtIns.end_call) {
    throw new Error("remote_required_system_tools_missing");
  }
  const activeBuiltIns = Object.entries(builtIns)
    .filter(([, tool]) => tool !== null)
    .map(([name]) => name)
    .sort();
  assertEqual(activeBuiltIns, ["end_call", "language_detection"], "remote_active_system_tools");

  const remoteKnowledge = actual.agent?.prompt?.knowledge_base ?? [];
  assertEqual(remoteKnowledge.length, 1, "remote_knowledge_count");
  assertEqual(
    remoteKnowledge[0]?.id,
    expected.agent.prompt.knowledge_base[0].id,
    "remote_knowledge_id",
  );
  assertEqual(
    remoteKnowledge[0]?.name,
    expected.agent.prompt.knowledge_base[0].name,
    "remote_knowledge_name",
  );
  assertEqual(actual.agent?.prompt?.rag?.enabled, true, "remote_rag_enabled");
  assertEqual(comparableTts(actual.tts), comparableTts(expected.tts), "remote_root_tts");

  const remoteLanguages = Object.keys(actual.language_presets ?? {}).sort();
  assertEqual(remoteLanguages, [...LANGUAGES].sort(), "remote_languages");
  for (const language of LANGUAGES) {
    const remotePreset = actual.language_presets[language]?.overrides;
    const expectedPreset = expected.language_presets[language].overrides;
    assertEqual(remotePreset?.agent?.language, language, `remote_${language}_language`);
    assertEqual(
      remotePreset?.agent?.first_message,
      expectedPreset.agent.first_message,
      `remote_${language}_first_message`,
    );
    assertEqual(
      remotePreset?.agent?.prompt?.prompt,
      expectedPreset.agent.prompt.prompt,
      `remote_${language}_prompt`,
    );
    assertEqual(
      comparableTts(remotePreset?.tts),
      comparableTts(expectedPreset.tts),
      `remote_${language}_tts`,
    );
  }
  return true;
}

function normaliseKnowledgeContent(value) {
  if (typeof value === "string") return value.trim();
  for (const candidate of [value?.content, value?.text, value?.document?.content, value?.document?.text]) {
    if (typeof candidate === "string") return candidate.trim();
  }
  throw new Error("remote_knowledge_content_missing");
}

export function verifyKnowledgeSnapshot(remoteContent, project) {
  assertEqual(normaliseKnowledgeContent(remoteContent), project.knowledge, "remote_knowledge_content");
  return true;
}

export async function writeRemoteBackup(project, { agent, knowledge }) {
  const directory = projectPath(
    project.config.backup_output_directory,
    "backup_output_directory",
  );
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await chmod(directory, 0o700);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const destination = path.join(directory, `${stamp}-before-sync.json`);
  const contents = `${JSON.stringify({ created_at: new Date().toISOString(), agent, knowledge }, null, 2)}\n`;
  await writeFile(destination, contents, { encoding: "utf8", mode: 0o600, flag: "wx" });
  await chmod(destination, 0o600);
  return destination;
}

export async function persistCreatedIds(project, { agentId, knowledgeDocumentId }) {
  assertId(agentId, "created_agent_id", { prefix: "agent_" });
  assertId(knowledgeDocumentId, "created_knowledge_document_id");
  const next = {
    ...project.config,
    status: "remote-created-unvalidated",
    agent_id: agentId,
    knowledge_document_id: knowledgeDocumentId,
  };
  const temporaryPath = `${project.configPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx",
  });
  await rename(temporaryPath, project.configPath);
  await chmod(project.configPath, 0o600);
}

export function publicPlan(project, payload, action) {
  return {
    status: "dry_run",
    action,
    remote_calls: false,
    agent_name: project.config.agent_name,
    languages: [...LANGUAGES],
    voices: Object.fromEntries(
      LANGUAGES.map((language) => [language, project.config.voices[language].id]),
    ),
    tts_model: project.config.model,
    knowledge_characters: project.knowledge.length,
    prompt_characters: project.prompt.length,
    custom_tool_ids: payload.conversation_config.agent.prompt.tool_ids,
    system_tools: ["language_detection", "end_call"],
    payload_sha256: payloadDigest(payload),
  };
}

export function optionValue(argv, name) {
  const prefix = `${name}=`;
  const inline = argv.find((argument) => argument.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = argv.indexOf(name);
  if (index === -1) return undefined;
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name}_value_missing`);
  return value;
}

export const supportedLanguages = LANGUAGES;
