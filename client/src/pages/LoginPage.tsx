// pages/LoginPage.tsx
import { useState } from "react";
import LavaBackground from "../animations/LavaBackground";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { setToken } from "../utils/auth";

export default function LoginPage() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      window.location.href = "/dashboard";
    } else {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <>
    <LavaBackground />
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            🔐 Login to Task Manager
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUser(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            <Button variant="contained" onClick={handleLogin} fullWidth>
              🚀 Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
    </>
  );
}
