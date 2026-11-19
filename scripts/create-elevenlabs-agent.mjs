#!/usr/bin/env node
import {
  apiRequest,
  buildAgentPayload,
  knowledgeCreatePayload,
  loadProject,
  optionValue,
  payloadDigest,
  persistCreatedIds,
  publicPlan,
  remoteId,
  verifyAgentSnapshot,
} from "./lib/elevenlabs-agent.mjs";

const argv = process.argv.slice(2);

function help() {
  process.stdout.write(`Usage:
  npm run agent:create
      Valide tous les fichiers et affiche le plan local. Aucun appel réseau.

  npm run agent:create -- --apply --confirm-create=ZAVENTEM
      Crée le document de connaissance puis l’agent ElevenLabs.

Options:
  --config <fichier>             Configuration locale (défaut: config/elevenlabs-agent.json)
  --apply                        Autorise les écritures distantes
  --confirm-create=ZAVENTEM      Confirmation littérale obligatoire
  --help                         Affiche cette aide

Variable requise en mode apply: ELEVENLABS_API_KEY
`);
}

async function main() {
  if (argv.includes("--help")) {
    help();
    return;
  }

  const project = await loadProject(optionValue(argv, "--config"));
  const localPayload = buildAgentPayload(project);
  const apply = argv.includes("--apply");
  if (!apply) {
    process.stdout.write(`${JSON.stringify(publicPlan(project, localPayload, "create"), null, 2)}\n`);
    return;
  }

  if (optionValue(argv, "--confirm-create") !== "ZAVENTEM") {
    throw new Error("remote_create_requires_--confirm-create=ZAVENTEM");
  }
  if (project.config.agent_id !== null || project.config.knowledge_document_id !== null) {
    throw new Error("remote_ids_already_present_use_agent_sync_instead");
  }
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY_missing_no_remote_call_performed");

  let knowledgeDocumentId = null;
  try {
    const knowledgeResult = await apiRequest({
      project,
      apiKey,
      pathname: "/v1/convai/knowledge-base/text",
      method: "POST",
      body: knowledgeCreatePayload(project),
      timeoutMs: 60_000,
    });
    knowledgeDocumentId = remoteId(knowledgeResult, "created_knowledge_document_id");

    const payload = buildAgentPayload(project, { knowledgeDocumentId });
    const createResult = await apiRequest({
      project,
      apiKey,
      pathname: "/v1/convai/agents/create",
      method: "POST",
      body: payload,
      timeoutMs: 60_000,
    });
    const agentId = remoteId(createResult, "created_agent_id");
    if (!agentId.startsWith("agent_")) throw new Error("created_agent_id_invalid_prefix");

    const remote = await apiRequest({
      project,
      apiKey,
      pathname: `/v1/convai/agents/${encodeURIComponent(agentId)}`,
    });
    verifyAgentSnapshot(remote, payload);
    await persistCreatedIds(project, { agentId, knowledgeDocumentId });

    process.stdout.write(`${JSON.stringify({
      status: "created_and_get_verified",
      agent_id: agentId,
      knowledge_document_id: knowledgeDocumentId,
      languages: project.config.languages,
      custom_tool_ids: [],
      payload_sha256: payloadDigest(payload),
      config_updated: true,
      live_audio_validation_required: true,
    }, null, 2)}\n`);
  } catch (error) {
    if (knowledgeDocumentId) {
      process.stderr.write(
        `La création n’a pas abouti après la création de la KB ${knowledgeDocumentId}; conservez cet identifiant pour nettoyage contrôlé.\n`,
      );
    }
    throw error;
  }
}

main().catch((error) => {
  process.stderr.write(`Création ElevenLabs interrompue: ${error.message}\n`);
  process.exitCode = 1;
});
