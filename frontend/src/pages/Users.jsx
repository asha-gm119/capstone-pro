import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Divider,
  Paper
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { registerApi } from "../api.js";
import { toast } from "react-toastify";

const ROLES = [
  { value: "airline", label: "Airline", color: "#6366f1"},
  { value: "baggage", label: "Baggage", color: "#71bbe7" }
];

export default function Users() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "airline",
  });
  const [busy, setBusy] = useState(false);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await registerApi(form);
      toast.success("User registered successfully");
      setForm({ name: "", email: "", password: "", role: "airline" });
    } finally {
      setBusy(false);
    }
  }

  const selectedRole = ROLES.find((r) => r.value === form.role);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Role Panel */}
        <Box
          sx={{
            flex: 1,
            background: `linear-gradient(135deg, ${selectedRole.color}20 0%, ${selectedRole.color}40 100%)`,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: selectedRole.color,
              width: 80,
              height: 80,
              mb: 2,
              fontSize: "2rem",
            }}
          >
            {selectedRole.icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {selectedRole.label}
          </Typography>
          <Chip
            label={selectedRole.value.toUpperCase()}
            sx={{
              bgcolor: `${selectedRole.color}25`,
              color: selectedRole.color,
              fontWeight: 600,
            }}
          />
          <Divider sx={{ my: 3, width: "60%", borderColor: "#e2e8f0" }} />
          <Typography variant="body2" sx={{ color: "#475569" }}>
            Each role comes with specific privileges inside the airport
            management system. Please ensure you assign the correct role when
            creating new users.
          </Typography>
        </Box>

        {/* Right Form */}
        <Box sx={{ flex: 2, p: { xs: 3, md: 5 }, bgcolor: "#f8fafc" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}
          >
            Create User Account
          </Typography>

          <form onSubmit={submit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter user's full name"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: "#64748b" }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  required
                  fullWidth
                  placeholder="user@example.com"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: "#64748b" }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  inputProps={{ minLength: 6 }}
                  required
                  fullWidth
                  placeholder="Minimum 6 characters"
                  helperText="Password must be at least 6 characters long"
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: "#64748b" }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="User Role"
                  select
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value)}
                  fullWidth
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={busy}
                  size="large"
                  startIcon={
                    busy ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Person />
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    background: busy
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #0ea5e9 0%, #63b1f1ff 100%)",
                    "&:hover": {
                      background: busy
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #0284c7 0%, #5fd9f8ff 100%)",
                    },
                  }}
                >
                  {busy ? "Creating..." : "Create User"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
