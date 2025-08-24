// src/pages/OpsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Stack, Grid, Card, CardHeader, CardContent, Typography,
  TextField, Button, CircularProgress, Divider,
  MenuItem, Select, FormControl, InputLabel, Paper, Chip
} from "@mui/material";
import {
  FlightTakeoff, Luggage, Schedule,
  NotificationsActive, AirplanemodeActive
} from "@mui/icons-material";
import { delayFlight, getAnalytics, listFlights } from "../api.js";
import { toast } from "react-toastify";

export default function OpsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ flightId: "", reason: "", newTime: "", flightNo: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [a, f] = await Promise.all([getAnalytics(), listFlights()]);
      setAnalytics(a.data);
      setFlights(f.data || []);
    } catch {
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flightId || !form.reason || !form.newTime) return toast.error("All fields required");
    setSubmitting(true);
    try {
      await delayFlight(form.flightId, { reason: form.reason, newTime: form.newTime });
      toast.success("Delay notification sent");
      setForm({ flightId: "", reason: "", newTime: "", flightNo: "" });
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch {
      toast.error("Failed to send delay notification");
    } finally { setSubmitting(false); }
  };

  const handleFlightChange = (id) => {
    const flight = flights.find(f => f._id === id);
    setForm(prev => ({ ...prev, flightId: id, flightNo: flight?.flightNo || "" }));
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress sx={{ color: "#1976d2" }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #0d47a1 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Operations Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            Monitor flight operations and manage delays efficiently
          </Typography>
        </Box>

        {/* KPI Strip */}
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              icon={<FlightTakeoff sx={{ color: "#1565c0" }} />}
              label={`Flights Today: ${analytics?.totalFlightsToday || 0}`}
              sx={{ background: "#e3f2fd", fontWeight: 600 }}
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<Luggage sx={{ color: "#2e7d32" }} />}
              label={`Baggage: ${analytics?.totalBaggageProcessed || 0}`}
              sx={{ background: "#e8f5e9", fontWeight: 600 }}
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<Schedule sx={{ color: "#ef6c00" }} />}
              label={`Total Flights: ${flights.length}`}
              sx={{ background: "#fff3e0", fontWeight: 600 }}
            />
          </Grid>
        </Grid>

        {/* Delay Notification Form */}
        <Card sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}>
          <CardHeader
            title="Delay Notification"
            subheader="Send alerts to passengers instantly"
            sx={{
              background: 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)',
              borderBottom: '1px solid #e0e0e0'
            }}
          />
          <Divider />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Flight</InputLabel>
                  <Select
                    value={form.flightId}
                    onChange={(e) => handleFlightChange(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        borderRadius: 2
                      }
                    }}
                  >
                    <MenuItem value="">Choose flight</MenuItem>
                    {flights.map(f => (
                      <MenuItem key={f._id} value={f._id}>
                        {f.flightNo} – {f.origin} → {f.destination}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {form.flightNo && (
                  <Paper sx={{
                    p: 2,
                    bgcolor: "rgba(255,248,225,0.7)",
                    border: "1px solid #ffe082",
                    borderRadius: 2
                  }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Selected Flight: {form.flightNo}
                    </Typography>
                  </Paper>
                )}

                <TextField
                  label="Reason"
                  value={form.reason}
                  onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  multiline rows={3} required fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  type="datetime-local"
                  label="New Departure"
                  InputLabelProps={{ shrink: true }}
                  value={form.newTime}
                  onChange={e => setForm(p => ({ ...p, newTime: e.target.value }))}
                  required fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: 2
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <NotificationsActive />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    background: 'linear-gradient(45deg, #fb8c00  100%, #fb8c00 1%)',
                    boxShadow: '0 3px 5px 2px rgba(251, 140, 0, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #fb8c00 100%, #fb8c00 100%)',
                    }
                  }}
                >
                  {submitting ? "Sending..." : "Send Notification"}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Flights List */}
        <Card sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}>
          <CardHeader
            title="Available Flights"
            subheader="Recently added flights"
            sx={{
              background: 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)',
              borderBottom: '1px solid #e0e0e0'
            }}
          />
          <Divider />
          <CardContent>
            {flights.length ? (
              <Grid container spacing={2}>
                {flights.slice(0, 6).map(f => {
                  let statusColor = "#1976d2"; // default blue
                  if (f.status === "On-Time") statusColor = "#2e7d32";
                  else if (f.status === "Delayed") statusColor = "#d32f2f";
                  else if (f.status === "Boarding") statusColor = "#f9a825";

                  return (
                    <Grid item xs={12} sm={6} md={4} key={f._id}>
                      <Paper sx={{
                        p: 2,
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        background: '#fff',
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        transition: "0.2s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transform: "translateY(-2px)"
                        }
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AirplanemodeActive sx={{ color: statusColor }} />
                          <Typography fontWeight={700}>{f.flightNo}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {f.origin} → {f.destination}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Status: <b style={{ color: statusColor }}>{f.status}</b> | Gate: {f.gate || "N/A"}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography align="center" py={3} color="text.secondary">
                No flights available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
