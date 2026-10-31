import { render, screen } from "@testing-library/react";
import ScoreCard from "./ScoreCard.jsx";

test("shows the score as a recommendation for a reviewer", () => {
  render(
    <ScoreCard
      scoreData={{
        score: 70,
        duration: 30,
        conversation: [],
        evaluationJobId: "job-123",
        evaluationStatus: "queued",
      }}
      onClose={() => {}}
    />,
  );
  expect(screen.getByText(/reviewer makes the final decision/i)).toBeTruthy();
  expect(screen.getByText(/job-123/)).toBeTruthy();
});
