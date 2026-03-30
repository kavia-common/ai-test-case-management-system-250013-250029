import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login when unauthenticated", () => {
  render(<App />);
  const title = screen.getByText(/welcome back|create account/i);
  expect(title).toBeInTheDocument();
});
