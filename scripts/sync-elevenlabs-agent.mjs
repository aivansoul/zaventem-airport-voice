#!/usr/bin/env node
import path from "node:path";

import {
  PROJECT_ROOT,
  apiRequest,
  buildAgentPayload,
  knowledgeUpdatePayload,
  loadProject,
  optionValue,
  payloadDigest,
  publicPlan,
  verifyAgentSnapshot,
  verifyKnowledgeSnapshot,
  writeRemoteBackup,
} from "./lib/elevenlabs-agent.mjs";

const argv = process.argv.slice(2);

function help() {
  process.stdout.write(`Usage:
  npm run agent:sync
      Valide la configuration et affiche le plan. Aucun appel réseau.

  npm run agent:sync -- --apply --confirm-sync=ZAVENTEM
      Sauvegarde l’état distant, synchronise la KB et l’agent, puis relit les deux.

Options:
  --config <fichier>           Configuration locale (défaut: config/elevenlabs-agent.json)
  --apply                      Autorise les écritures distantes
  --confirm-sync=ZAVENTEM      Confirmation littérale obligatoire
  --help                       Affiche cette aide

Variable requise en mode apply: ELEVENLABS_API_KEY
`);
}

function remoteIds(project) {
  const agentId = process.env.ELEVENLABS_AGENT_ID?.trim() || project.config.agent_id;
  const knowledgeDocumentId =
    process.env.ELEVENLABS_KNOWLEDGE_DOCUMENT_ID?.trim() ||
    project.config.knowledge_document_id;
  if (typeof agentId !== "string" || !agentId.startsWith("agent_")) {
    throw new Error("agent_id_missing_run_agent_create_first");
  }
  if (typeof knowledgeDocumentId !== "string" || knowledgeDocumentId.length < 10) {
    throw new Error("knowledge_document_id_missing_run_agent_create_first");
  }
  return { agentId, knowledgeDocumentId };
}

async function main() {
  if (argv.includes("--help")) {
    help();
    return;
  }

  const project = await loadProject(optionValue(argv, "--config"));
  const { agentId, knowledgeDocumentId } = remoteIds(project);
  const payload = buildAgentPayload(project, { knowledgeDocumentId });
  const apply = argv.includes("--apply");
  if (!apply) {
    process.stdout.write(`${JSON.stringify({
      ...publicPlan(project, payload, "sync"),
      agent_id: agentId,
      knowledge_document_id: knowledgeDocumentId,
      backup_mode: "0600_before_any_write",
    }, null, 2)}\n`);
    return;
  }

  if (optionValue(argv, "--confirm-sync") !== "ZAVENTEM") {
    throw new Error("remote_sync_requires_--confirm-sync=ZAVENTEM");
  }
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY_missing_no_remote_call_performed");

  const [beforeAgent, beforeKnowledge] = await Promise.all([
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
  const backupPath = await writeRemoteBackup(project, {
    agent: beforeAgent,
    knowledge: beforeKnowledge,
  });

  await apiRequest({
    project,
    apiKey,
    pathname: `/v1/convai/knowledge-base/${encodeURIComponent(knowledgeDocumentId)}`,
    method: "PATCH",
    body: knowledgeUpdatePayload(project),
    timeoutMs: 60_000,
  });

  await apiRequest({
    project,
    apiKey,
    pathname: `/v1/convai/agents/${encodeURIComponent(agentId)}`,
    method: "PATCH",
    body: {
      ...payload,
      version_description:
        "Brussels Airport prototype: controlled FR-NL-EN prompt, voices and passenger KB",
    },
    timeoutMs: 60_000,
  });

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
  verifyAgentSnapshot(remoteAgent, payload);
  verifyKnowledgeSnapshot(remoteKnowledge, project);

  process.stdout.write(`${JSON.stringify({
    status: "synced_and_get_verified",
    agent_id: agentId,
    knowledge_document_id: knowledgeDocumentId,
    payload_sha256: payloadDigest(payload),
    knowledge_sha256: payloadDigest(project.knowledge),
    backup_file: path.relative(PROJECT_ROOT, backupPath),
    backup_permissions: "0600",
    live_audio_validation_required: true,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Synchronisation ElevenLabs interrompue: ${error.message}\n`);
  process.exitCode = 1;
});
