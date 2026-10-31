export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Hiresense API",
    version: "1.0.0",
    description: "Interview screening API. Model output is a recommendation. A reviewer records the decision.",
  },
  paths: {
    "/api/evaluations": {
      post: {
        summary: "Queue a transcript for scoring",
        responses: { 202: { description: "Job queued" }, 400: { description: "Invalid body" }, 401: { description: "Missing token" } },
      },
    },
    "/api/evaluations/{id}": {
      get: {
        summary: "Read scoring job status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "queued, active, completed, or failed" }, 404: { description: "Unknown job" } },
      },
    },
    "/api/evaluations/{id}/decision": {
      post: {
        summary: "Record a human decision",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Decision stored" } },
      },
    },
  },
};
