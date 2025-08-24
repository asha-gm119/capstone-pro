import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardContent, Button, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, IconButton, TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Tooltip, Box, Typography, Avatar, Divider, 
  CircularProgress, Grid, alpha, useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import { listFlights, createFlight, updateFlight, deleteFlight } from "../api.js";
import { toast } from "react-toastify";
import { useAuth } from "../auth.jsx";
import Swal from "sweetalert2";

const FLIGHT_STATUSES = ["scheduled", "boarding", "departed", "arrived", "delayed", "cancelled"];

export default function Flights() {
  const theme = useTheme();
  const { user } = useAuth();
  const canCreate = ["admin", "airline"].includes(user.role);
  const canEdit = ["admin", "airline"].includes(user.role);
  const canDelete = user.role === "admin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);

  async function refresh() {
    setLoading(true);
    try {
      const { data } = await listFlights();
      setRows(data || []);
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("Failed to load flights");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const filteredRows = rows.filter(flight =>
    flight.flightNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.gate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreate(data) {
    try {
      await createFlight(data);
      toast.success("Flight schedule created successfully");
      setOpenCreate(false);
      refresh();
    } catch (err) {
      toast.error("Failed to create flight");
    }
  }

  async function handleEdit(id, data) {
    try {
      await updateFlight(id, data);
      toast.success("Flight updated successfully");
      setOpenEdit(null);
      refresh();
    } catch (err) {
      toast.error("Failed to update flight");
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This will permanently remove the flight schedule",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete flight",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await deleteFlight(id);
        toast.success("Flight schedule deleted");
        refresh();
      } catch (err) {
        toast.error("Failed to delete flight");
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Flight Operations
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Manage airline schedules and flight status in real-time
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {canCreate && (
            <Button 
              startIcon={<AddIcon />} 
              variant="contained" 
              onClick={() => setOpenCreate(true)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              }}
            >
              Schedule Flight
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Stats Cards */}
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center', 
            height: '100%', 
            minHeight: 140,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid #90caf9',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <FlightTakeoffIcon sx={{ fontSize: 30, color: '#1976d2', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0d47a1' }}>
                {rows.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Total Flights
              </Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center', 
            height: '100%', 
            minHeight: 140,
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            border: '1px solid #a5d6a7',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)'
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <FlightLandIcon sx={{ fontSize: 30, color: '#2e7d32', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                {rows.filter(f => f.status === 'arrived').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Arrived Today
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center', 
            height: '100%', 
            minHeight: 140,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: '1px solid #ffcc80',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #f57c00 0%, #ffb74d 100%)'
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <ScheduleIcon sx={{ fontSize: 30, color: '#f57c00', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#e65100' }}>
                {rows.filter(f => f.status === 'scheduled').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Scheduled
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center', 
            height: '100%', 
            minHeight: 140,
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            border: '1px solid #ef9a9a',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #c62828 0%, #ef5350 100%)'
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <AirlineSeatReclineNormalIcon sx={{ fontSize: 30, color: '#c62828', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#b71c1c' }}>
                {rows.filter(f => f.status === 'delayed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Delayed
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid> */}

      {/* Search and Controls */}
      <Card sx={{ 
        mb: 2, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
        border: '1px solid #e0e0e0'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search flights..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{ 
                flex: 1, 
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  background: '#fff',
                  borderRadius: 2
                }
              }}
            />
            <Button
              startIcon={<RefreshIcon />}
              onClick={refresh}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  background: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card sx={{ 
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        overflow: 'hidden'
      }}>
        <CardHeader
          title="Flight Schedule"
          subheader={`${filteredRows.length} flights found • Real-time updates`}
          sx={{
            background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
            borderBottom: '1px solid #e0e0e0'
          }}
        />
        
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                  '& th': {
                    fontWeight: 600,
                    color: '#424242',
                    py: 2,
                    borderBottom: '2px solid #e0e0e0'
                  }
                }}>
                  <TableCell>Flight Number</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Gate</TableCell>
                  <TableCell>Departure</TableCell>
                  <TableCell>Arrival</TableCell>
                  {(canEdit || canDelete) && <TableCell align="center">Operations</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Loading flight schedule...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((flight) => (
                    <TableRow key={flight._id} hover sx={{ '&:hover': { background: '#fafafa' } }}>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {flight.flightNo}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {flight.origin}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            →
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {flight.destination}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={flight.status || "scheduled"} 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: statusColor(flight.status).bg,
                            color: statusColor(flight.status).text,
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        {flight.gate || "Not assigned"}
                      </TableCell>
                      <TableCell>
                        {formatMaybeDate(flight.scheduledDep)}
                      </TableCell>
                      <TableCell>
                        {formatMaybeDate(flight.scheduledArr)}
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            {canEdit && (
                              <Tooltip title="Modify Flight">
                                <IconButton 
                                  size="small"
                                  onClick={() => setOpenEdit(flight)}
                                  sx={{ 
                                    color: '#1976d2',
                                    '&:hover': { 
                                      background: 'rgba(25, 118, 210, 0.1)'
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canDelete && (
                              <Tooltip title="Remove Flight">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDelete(flight._id)}
                                  sx={{ 
                                    color: '#d32f2f',
                                    '&:hover': { 
                                      background: 'rgba(211, 47, 47, 0.1)'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
                {!loading && filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <FlightTakeoffIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        No flights found
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Schedule a new flight to get started'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <CreateFlightDialog open={openCreate} onClose={() => setOpenCreate(false)} onSubmit={handleCreate} />
      {openEdit && (
        <EditFlightDialog
          open={!!openEdit}
          record={openEdit}
          onClose={() => setOpenEdit(null)}
          onSubmit={(payload) => handleEdit(openEdit._id, payload)}
        />
      )}
    </Box>
  );
}

function statusColor(s) {
  switch (s) {
    case "boarding": return { bg: '#e3f2fd', text: '#1565c0' };
    case "departed": return { bg: '#e8f5e9', text: '#2e7d32' };
    case "arrived": return { bg: '#f1f8e9', text: '#558b2f' };
    case "delayed": return { bg: '#fff3e0', text: '#ef6c00' };
    case "cancelled": return { bg: '#ffebee', text: '#c62828' };
    default: return { bg: '#f5f5f5', text: '#424242' };
  }
}

function formatMaybeDate(v) {
  if (!v) return "-";
  try { 
    return new Date(v).toLocaleString(); 
  } catch { 
    return String(v); 
  }
}

function CreateFlightDialog({ open, onClose, onSubmit }) {
  const [flightNo, setFlightNo] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  function validate() {
    const iata = /^[A-Za-z]{3}$/;
    if (!flightNo.trim()) return "Flight number is required";
    if (!iata.test(origin)) return "Origin must be a valid 3-letter IATA code";
    if (!iata.test(destination)) return "Destination must be a valid 3-letter IATA code";
    if (status && !FLIGHT_STATUSES.includes(status)) return "Please select a valid status";
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    await onSubmit({ 
      flightNo: flightNo.trim(), 
      origin: origin.toUpperCase(), 
      destination: destination.toUpperCase(), 
      status: status || undefined 
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
        color: 'white',
        fontWeight: 600
      }}>
        Schedule New Flight
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField 
            label="Flight Number" 
            value={flightNo} 
            onChange={(e) => setFlightNo(e.target.value)} 
            required 
            placeholder="e.g., AA123"
          />
          <TextField 
            label="Origin Airport (IATA)" 
            value={origin} 
            onChange={(e) => setOrigin(e.target.value)} 
            inputProps={{ maxLength: 3 }} 
            required 
            placeholder="e.g., JFK"
          />
          <TextField 
            label="Destination Airport (IATA)" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            inputProps={{ maxLength: 3 }} 
            required 
            placeholder="e.g., LAX"
          />
          <TextField 
            label="Initial Status" 
            select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">Scheduled (default)</MenuItem>
            {FLIGHT_STATUSES.map(s => (
              <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Create Flight</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditFlightDialog({ open, onClose, onSubmit, record }) {
  const [status, setStatus] = useState(record.status || "");
  const [gate, setGate] = useState(record.gate || "");
  const [scheduledDep, setScheduledDep] = useState(record.scheduledDep ? toLocalInputValue(record.scheduledDep) : "");
  const [scheduledArr, setScheduledArr] = useState(record.scheduledArr ? toLocalInputValue(record.scheduledArr) : "");

  function toLocalInputValue(dateStr) {
    try {
      const d = new Date(dateStr);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return ""; }
  }

  function validate() {
    if (status && !FLIGHT_STATUSES.includes(status)) return "Please select a valid status";
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    const payload = {
      ...(status ? { status } : {}),
      ...(gate ? { gate } : { gate: "" }),
      ...(scheduledDep ? { scheduledDep: new Date(scheduledDep).toISOString() } : { scheduledDep: null }),
      ...(scheduledArr ? { scheduledArr: new Date(scheduledArr).toISOString() } : { scheduledArr: null }),
    };
    await onSubmit(payload);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
        color: 'white',
        fontWeight: 600
      }}>
        Update Flight — {record.flightNo}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField 
            label="Flight Status" 
            select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">Keep current status</MenuItem>
            {FLIGHT_STATUSES.map(s => (
              <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Gate Assignment" 
            value={gate} 
            onChange={(e) => setGate(e.target.value)} 
            placeholder="e.g., A12"
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Departure Time"
              type="datetime-local"
              value={scheduledDep}
              onChange={(e) => setScheduledDep(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Arrival Time"
              type="datetime-local"
              value={scheduledArr}
              onChange={(e) => setScheduledArr(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Discard Changes</Button>
        <Button variant="contained" onClick={submit}>Update Flight</Button>
      </DialogActions>
    </Dialog>
  );
}