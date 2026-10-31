import fs from "fs";
import path from "path";

const root = path.resolve("public/temp");

// Only files under public/temp can be removed. This blocks path traversal.
export function purgeRecording(recordingPath) {
  if (!recordingPath || process.env.PURGE_RECORDINGS !== "true") return false;
  const target = path.resolve(recordingPath);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return false;
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return false;
  fs.unlinkSync(target);
  return true;
}
