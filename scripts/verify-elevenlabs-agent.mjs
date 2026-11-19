#!/usr/bin/env node
import {
  apiRequest,
  buildAgentPayload,
  loadProject,
  optionValue,
  payloadDigest,
  verifyAgentSnapshot,
  verifyKnowledgeSnapshot,
} from "./lib/elevenlabs-agent.mjs";

const argv = process.argv.slice(2);

function help() {
  process.stdout.write(`Usage:
  ELEVENLABS_API_KEY=… npm run agent:verify

Relit l’agent et le contenu de sa KB, puis compare le prompt, les trois langues,
les trois voix, les outils, le modèle et la base documentaire. Lecture seule.

Options:
  --config <fichier>    Configuration locale (défaut: config/elevenlabs-agent.json)
  --help                Affiche cette aide

Les variables ELEVENLABS_AGENT_ID et ELEVENLABS_KNOWLEDGE_DOCUMENT_ID peuvent
remplacer temporairement les identifiants du fichier local.
`);
}

async function main() {
  if (argv.includes("--help")) {
    help();
    return;
  }
  const project = await loadProject(optionValue(argv, "--config"));
  const agentId = process.env.ELEVENLABS_AGENT_ID?.trim() || project.config.agent_id;
  const knowledgeDocumentId =
    process.env.ELEVENLABS_KNOWLEDGE_DOCUMENT_ID?.trim() ||
    project.config.knowledge_document_id;
  if (typeof agentId !== "string" || !agentId.startsWith("agent_")) {
    throw new Error("agent_id_missing");
  }
  if (typeof knowledgeDocumentId !== "string" || knowledgeDocumentId.length < 10) {
    throw new Error("knowledge_document_id_missing");
  }
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY_missing");

  const expected = buildAgentPayload(project, { knowledgeDocumentId });
  const [remoteAgent, remoteKnowledge] = await Promise.all([
    apiRequest({
      project,
      apiKey,
      pathname: `/v1/convai/agents/${encodeURIComponent(agentId)}`,
    }),
    apiRequest({
      project,
      apiKey,
      pathname: `/v1/convai/knowledge-base/${encodeURIComponent(knowledgeDocumentId)}/content`,
    }),
  ]);
  verifyAgentSnapshot(remoteAgent, expected);
  verifyKnowledgeSnapshot(remoteKnowledge, project);

  process.stdout.write(`${JSON.stringify({
    status: "remote_snapshot_matches_local",
    read_only: true,
    agent_id: agentId,
    knowledge_document_id: knowledgeDocumentId,
    languages: project.config.languages,
    voices: Object.fromEntries(
      project.config.languages.map((language) => [language, project.config.voices[language].id]),
    ),
    system_tools: ["language_detection", "end_call"],
    custom_tool_ids: [],
    prompt_sha256: payloadDigest(project.prompt),
    knowledge_sha256: payloadDigest(project.knowledge),
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Vérification ElevenLabs en échec: ${error.message}\n`);
  process.exitCode = 1;
});
