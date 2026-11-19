import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(args, environment = {}) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

test("agent creation is a network-free dry-run by default", () => {
  const result = run(["scripts/create-elevenlabs-agent.mjs"]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, "dry_run");
  assert.equal(output.remote_calls, false);
  assert.deepEqual(output.custom_tool_ids, []);
});

test("--apply without the literal creation confirmation is rejected before credentials", () => {
  const result = run(
    ["scripts/create-elevenlabs-agent.mjs", "--apply"],
    { ELEVENLABS_API_KEY: "not-a-real-key-and-never-sent" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--confirm-create=ZAVENTEM/);
});

test("an incorrect creation confirmation is rejected", () => {
  const result = run(
    [
      "scripts/create-elevenlabs-agent.mjs",
      "--apply",
      "--confirm-create=BRUSSELS",
    ],
    { ELEVENLABS_API_KEY: "not-a-real-key-and-never-sent" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--confirm-create=ZAVENTEM/);
});

test("agent sync is a network-free dry-run when remote IDs are supplied", () => {
  const result = run(
    ["scripts/sync-elevenlabs-agent.mjs"],
    {
      ELEVENLABS_AGENT_ID: "agent_TestOnly123456789",
      ELEVENLABS_KNOWLEDGE_DOCUMENT_ID: "KnowledgeTestOnly123456789",
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, "dry_run");
  assert.equal(output.remote_calls, false);
  assert.equal(output.backup_mode, "0600_before_any_write");
});

test("--apply without the literal sync confirmation is rejected before credentials", () => {
  const result = run(
    ["scripts/sync-elevenlabs-agent.mjs", "--apply"],
    {
      ELEVENLABS_AGENT_ID: "agent_TestOnly123456789",
      ELEVENLABS_KNOWLEDGE_DOCUMENT_ID: "KnowledgeTestOnly123456789",
      ELEVENLABS_API_KEY: "not-a-real-key-and-never-sent",
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--confirm-sync=ZAVENTEM/);
});
