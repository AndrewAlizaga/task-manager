import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { fetchWithAuth } from "../api/client";

// Mock the fetchWithAuth module
jest.mock("../api/client", () => ({
  fetchWithAuth: jest.fn(),
}));

describe("Dashboard", () => {
  const mockTasks = [
    { id: 1, title: "First Task", description: "Do something", status: "pending" },
    { id: 2, title: "Second Task", description: "Do another thing", status: "progress" },
  ];

  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/tasks") return Promise.resolve(mockTasks);
      return Promise.resolve();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard and loads tasks", async () => {
    render(<Dashboard />);
    expect(await screen.findByText("First Task")).toBeInTheDocument();
    expect(screen.getByText("Second Task")).toBeInTheDocument();
  });

  it("shows empty state when there are no tasks", async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce([]); // For loadTasks()
    render(<Dashboard />);
    expect(await screen.findByText(/no tasks available/i)).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    render(<Dashboard />);

    // Simulate inputs
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Details" },
    });

    // Add Task
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(fetchWithAuth).toHaveBeenCalledWith("/api/tasks", expect.objectContaining({
        method: "POST",
      }));
    });
  });

  it("deletes a task", async () => {
    render(<Dashboard />);
    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(fetchWithAuth).toHaveBeenCalledWith("/api/tasks/1", { method: "DELETE" });
    });
  });
});
