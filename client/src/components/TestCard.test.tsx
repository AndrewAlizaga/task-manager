/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard, { Task } from "./TaskCard";

describe("TaskCard", () => {
  const mockTask: Task = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "pending",
  };

  const onDelete = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task info in view mode", () => {
    render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={onUpdate} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByLabelText("edit")).toBeInTheDocument();
    expect(screen.getByLabelText("delete")).toBeInTheDocument();
  });

  it("switches to edit mode when edit button is clicked", () => {
    render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByLabelText("edit"));
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
  });

  it("updates task and exits edit mode", () => {
    render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByLabelText("edit"));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onUpdate).toHaveBeenCalledWith(
      mockTask.id,
      "Updated Task",
      mockTask.description,
      mockTask.status
    );
  });

  it("cancels editing without calling update", () => {
    render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByLabelText("edit"));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Title" },
    });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.queryByText("New Title")).not.toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText("delete"));
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });
});
