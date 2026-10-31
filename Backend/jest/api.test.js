import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

process.env.ACCESS_TOKEN_SECRET = "test-secret";
process.env.QUEUE_INLINE = "true";
process.env.NODE_ENV = "test";

jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findById: () => ({
      select: async () => ({ _id: "user-1", role: "recruiter", email: "reviewer@example.com" }),
    }),
  },
}));

const { default: app } = await import("../app.js");
const { default: request } = await import("supertest");

const token = jwt.sign({ _id: "user-1" }, process.env.ACCESS_TOKEN_SECRET);

describe("evaluations API", () => {
  test("rejects missing auth", async () => {
    const res = await request(app).post("/api/evaluations").send({ jobId: "j" });
    expect(res.status).toBe(401);
  });

  test("queues a transcript and exposes OpenAPI", async () => {
    const created = await request(app)
      .post("/api/evaluations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        jobId: "job-1",
        candidateId: "cand-1",
        transcript: [{ question: "Tell me about a project.", answer: "I do not know." }],
      });
    expect(created.status).toBe(202);
    expect(created.body.id).toEqual(expect.any(String));

    await new Promise((resolve) => setTimeout(resolve, 80));
    const status = await request(app)
      .get(`/api/evaluations/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(status.status).toBe(200);
    expect(["queued", "active", "completed"]).toContain(status.body.status);

    const docs = await request(app).get("/api-docs.json");
    expect(docs.status).toBe(200);
    expect(docs.body.paths["/api/evaluations"]).toBeTruthy();
  });

  test("rejects a bad upload type", async () => {
    const res = await request(app)
      .post("/api/ai/cvanalysis")
      .set("Authorization", `Bearer ${token}`)
      .attach("resume", Buffer.from("not a pdf"), { filename: "notes.txt", contentType: "text/plain" });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
