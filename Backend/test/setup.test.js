import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("setup files the README points at exist", () => {
  for (const rel of [
    "LICENSE",
    "Backend/.env.example",
    "Frontend/.env.example",
    "Frontend/vite.config.js",
    "Backend/package.json",
  ]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, rel);
  }
  const backendPkg = JSON.parse(fs.readFileSync(path.join(root, "Backend/package.json"), "utf8"));
  assert.equal(typeof backendPkg.scripts.dev, "string");
  const example = fs.readFileSync(path.join(root, "Backend/.env.example"), "utf8");
  for (const key of ["MONGO_URI", "JWT_SECRET", "OPENAI_API_KEY", "GEMINI_API_KEY", "ACCESS_TOKEN_SECRET"]) {
    assert.match(example, new RegExp(`^${key}=`, "m"));
  }
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert.match(readme, /cd Backend/);
  assert.match(readme, /cd Frontend/);
  assert.doesNotMatch(readme, /Hugging Face/);
});
