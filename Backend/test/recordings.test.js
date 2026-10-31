import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { purgeRecording } from "../services/recordings.js";

test("purge removes a file in public/temp only when enabled", () => {
  const dir = path.resolve("public/temp");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "purge-test.txt");
  fs.writeFileSync(file, "audio");
  process.env.PURGE_RECORDINGS = "false";
  assert.equal(purgeRecording(file), false);
  assert.equal(fs.existsSync(file), true);
  process.env.PURGE_RECORDINGS = "true";
  assert.equal(purgeRecording(file), true);
  assert.equal(fs.existsSync(file), false);
  assert.equal(purgeRecording(path.resolve("package.json")), false);
});
