import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { fetchWithAuth } from "../api/client";
import LoginPage from "./LoginPage";

// Mock global.fetch
beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ token: "fake-token" }),
    }) as jest.Mock;
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
    
  describe("LoginPage", () => {
    it("logs in a user and redirects", async () => {
        Object.defineProperty(window, "location", {
            value: { href: "", assign: jest.fn(), replace: jest.fn() },
            writable: true,
          });
  
      render(<LoginPage />);
  
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "test" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });
  
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
  
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/login"),
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "test",
              password: "password123",
            }),
          })
        );
      });
  
      expect(window.location.href).toBe("/dashboard");
    });
  });