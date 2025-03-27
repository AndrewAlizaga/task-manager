// pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/client";
import LavaBackground from "../animations/LavaBackground";
import TaskCard, { Task } from "../components/TaskCard";

import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("pending");

  const loadTasks = async () => {
    const data = await fetchWithAuth("/api/tasks");
    setTasks(data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await fetchWithAuth("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description: desc, status }),
    });
    setTitle("");
    setDesc("");
    setStatus("pending");
    loadTasks();
  };

  const deleteTask = async (id: number) => {
    await fetchWithAuth(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  const updateTask = async (
    id: number,
    title: string,
    description: string,
    status: string
  ) => {
    await fetchWithAuth(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, status }),
    });
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <LavaBackground />
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          📋 Task Dashboard
        </Typography>

        <Stack spacing={2} mb={4}>
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Task Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
          />
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="progress">In Progress</MenuItem>
            <MenuItem value="finished">Finished</MenuItem>
          </Select>
          <Button variant="contained" onClick={addTask}>
            ➕ Add Task
          </Button>
        </Stack>

        <Stack spacing={2}>
          {tasks.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No tasks available.
            </Typography>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))
          )}
        </Stack>
      </Container>
    </>
  );
}
