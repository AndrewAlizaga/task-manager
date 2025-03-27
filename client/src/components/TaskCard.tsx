// components/TaskCard.tsx
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    Button,
    Box,
    Stack,
    MenuItem,
    Select,
    SelectChangeEvent,
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import { useState } from "react";
  
  export type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
  };
  
  interface TaskCardProps {
    task: Task;
    onDelete: (id: number) => void;
    onUpdate: (id: number, title: string, description: string, status: string) => void;
  }
  
  const statuses = ["pending", "progress", "finished"];
  
  export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);
    const [editStatus, setEditStatus] = useState(task.status);
  
    const handleUpdate = () => {
      onUpdate(task.id, editTitle, editDesc, editStatus);
      setIsEditing(false);
    };
  
    return (
      <Card variant="outlined">
        <CardContent>
          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                label="Title"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
              <Select
                label="Status"
                fullWidth
                value={editStatus}
                onChange={(e: SelectChangeEvent) => setEditStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontWeight: 500 }}
                >
                  {task.status}
                </Typography>
              </div>
              <Box display="flex" gap={1}>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => onDelete(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }
  