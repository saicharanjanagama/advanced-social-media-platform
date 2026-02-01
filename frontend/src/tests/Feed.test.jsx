import { render, screen } from "@testing-library/react";
import Feed from "../pages/Feed";
import { vi } from "vitest";

// 🔧 Mock auth (not logged in)
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null
  })
}));

// 🔧 Mock API calls
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] })
  }
}));

test("renders feed safely when not logged in", async () => {
  render(<Feed />);

  // Feed title exists (component renders)
  expect(
    await screen.findByText(/live feed/i)
  ).toBeInTheDocument();

  // No posts rendered
  expect(
    screen.queryByText(/add a comment/i)
  ).not.toBeInTheDocument();
});
