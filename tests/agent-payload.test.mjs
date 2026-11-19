import assert from "node:assert/strict";
import test from "node:test";

import {
  assertNoMixedToolPayload,
  buildAgentPayload,
  loadProject,
  verifyAgentSnapshot,
  verifyKnowledgeSnapshot,
} from "../scripts/lib/elevenlabs-agent.mjs";

const project = await loadProject();
const knowledgeDocumentId = "KnowledgeDocument123";
const payload = buildAgentPayload(project, { knowledgeDocumentId });
const conversation = payload.conversation_config;
const prompt = conversation.agent.prompt;

test("the payload never mixes tools and tool_ids", () => {
  assert.equal(assertNoMixedToolPayload(payload), true);
  assert.deepEqual(prompt.tool_ids, []);
  assert.equal(Object.hasOwn(prompt, "tools"), false);
});

test("only language_detection and end_call are active system tools", () => {
  const active = Object.entries(prompt.built_in_tools)
    .filter(([, value]) => value !== null)
    .map(([name]) => name)
    .sort();
  assert.deepEqual(active, ["end_call", "language_detection"]);
  assert.equal(prompt.built_in_tools.language_detection.pre_tool_speech, "off");
  assert.equal(prompt.built_in_tools.end_call.pre_tool_speech, "off");
});

test("the three language presets use the approved voices and settings", () => {
  assert.deepEqual(Object.keys(conversation.language_presets).sort(), ["en", "fr", "nl"]);
  assert.equal(project.config.tts_settings.style, 0);
  for (const language of ["fr", "nl", "en"]) {
    const tts = conversation.language_presets[language].overrides.tts;
    assert.equal(project.config.voices[language].gender, "male");
    assert.equal(project.config.voices[language].age, "middle_aged");
    assert.equal(tts.voice_id, project.config.voices[language].id);
    assert.equal(tts.model_id, "eleven_v4_turbo");
    assert.equal(tts.stability, 0.45);
    assert.equal(tts.similarity_boost, 0.75);
    assert.equal(tts.speed, 1);
  }
});

test("the agent uses the low-latency realtime model and an 850 ms hard SLA", () => {
  assert.equal(conversation.realtime_model, "eleven_realtime_v1_mini");
  assert.equal(project.config.voice_persona.gender, "male");
  assert.equal(project.config.voice_persona.age_range, "42-55");
  assert.equal(project.config.latency_sla.metric, "convai_ttf_audio_since_silence");
  assert.equal(project.config.latency_sla.maximum_ms, 850);
  assert.equal(project.config.latency_sla.scope, "public_preselected_language_audio_turns");
  assert.equal(conversation.turn.turn_model, "turn_v3");
  assert.equal(conversation.turn.turn_eagerness, "eager");
  assert.equal(conversation.turn.spelling_patience, "auto");
  assert.equal(conversation.turn.speculative_turn, true);
  assert.equal(prompt.max_tokens, 120);
  assert.equal(prompt.rag.max_retrieved_rag_chunks_count, 2);
});

test("the public modal may select a supported language at session start", () => {
  assert.equal(
    payload.platform_settings.overrides.conversation_config_override.agent.language,
    true,
  );
});

test("the controlled knowledge document is the only attached document", () => {
  assert.deepEqual(prompt.knowledge_base, [
    {
      type: "text",
      name: project.config.knowledge_document_name,
      id: knowledgeDocumentId,
      usage_mode: "prompt",
    },
  ]);
  assert.equal(prompt.rag.enabled, true);
});

test("a matching remote snapshot passes and a changed voice fails", () => {
  const matchingRemote = structuredClone(payload);
  assert.equal(verifyAgentSnapshot(matchingRemote, payload), true);
  const driftedRemote = structuredClone(payload);
  driftedRemote.conversation_config.language_presets.nl.overrides.tts.voice_id =
    "UnexpectedVoice123";
  assert.throws(
    () => verifyAgentSnapshot(driftedRemote, payload),
    /remote_nl_tts_mismatch/,
  );
});

test("remote verification rejects an origin allowlist drift", () => {
  const driftedRemote = structuredClone(payload);
  driftedRemote.platform_settings.auth.allowlist = [{ hostname: "example.invalid" }];
  assert.throws(
    () => verifyAgentSnapshot(driftedRemote, payload),
    /remote_origin_allowlist_mismatch/,
  );
});

test("knowledge verification detects content drift", () => {
  assert.equal(verifyKnowledgeSnapshot({ content: project.knowledge }, project), true);
  assert.throws(
    () => verifyKnowledgeSnapshot({ content: `${project.knowledge}\nold` }, project),
    /remote_knowledge_content_mismatch/,
  );
});
