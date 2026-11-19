import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const modal = await readFile(
  new URL("../components/voicebot-modal.tsx", import.meta.url),
  "utf8",
);

test("the public voice session uses the stable WebSocket transport", () => {
  assert.match(modal, /connectionType:\s*"websocket"/u);
  assert.doesNotMatch(modal, /connectionType:\s*"webrtc"/u);
  assert.match(modal, /await startSession\(/u);
  assert.match(modal, /onDisconnect:\s*\(details\)/u);
  assert.match(modal, /details\.reason === "error"/u);
});
