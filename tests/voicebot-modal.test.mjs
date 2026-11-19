import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const modal = await readFile(
  new URL("../components/voicebot-modal.tsx", import.meta.url),
  "utf8",
);

test("the public voice session uses WebRTC", () => {
  assert.match(modal, /connectionType:\s*"webrtc"/u);
  assert.doesNotMatch(modal, /connectionType:\s*"websocket"/u);
  assert.match(modal, /await startSession\(/u);
});
