import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";

test("renders login form", () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );

  // Heading
  expect(
    screen.getByRole("heading", { name: /login/i })
  ).toBeInTheDocument();

  // Inputs
  expect(
    screen.getByPlaceholderText(/email/i)
  ).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText(/password/i)
  ).toBeInTheDocument();

  // Button
  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();
});
