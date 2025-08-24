import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardContent, Button, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, IconButton, TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Tooltip, Box, CircularProgress, Alert, Avatar,
  Typography, Divider, Grid, alpha, useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LuggageIcon from "@mui/icons-material/Luggage";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { listBaggage, createBaggage, updateBaggage, deleteBaggage, listFlights } from "../api.js";
import { toast } from "react-toastify";
import { useAuth } from "../auth.jsx";

const BAGGAGE_STATUSES = ["checkin", "loaded", "intransit", "unloaded", "atbelt", "lost"];

export default function Baggage() {
  const theme = useTheme();
  const { user } = useAuth();
  const canCreate = ["admin", "baggage", "airline"].includes(user.role);
  const canEdit = ["admin", "baggage"].includes(user.role);
  const canDelete = ["admin", "baggage"].includes(user.role);

  const [rows, setRows] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [baggageRes, flightsRes] = await Promise.all([
        listBaggage(),
        listFlights()
      ]);
      setRows(baggageRes.data || []);
      setFlights(flightsRes.data || []);
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const filteredRows = rows.filter(row =>
    row.tagId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.flightId?.flightNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.lastLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreate(data) {
    try {
      await createBaggage(data);
      toast.success("Baggage created successfully");
      setOpenCreate(false);
      refresh();
    } catch (err) {
      toast.error("Failed to create baggage");
      console.error("Create error:", err);
    }
  }

  async function handleEdit(idOrTag, data) {
    try {
      await updateBaggage(idOrTag, data);
      toast.success("Baggage updated successfully");
      setOpenEdit(null);
      refresh();
    } catch (err) {
      toast.error("Failed to update baggage");
      console.error("Update error:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this baggage record?")) return;
    
    try {
      await deleteBaggage(id);
      toast.success("Baggage deleted successfully");
      refresh();
    } catch (err) {
      toast.error("Failed to delete baggage");
      console.error("Delete error:", err);
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
              Baggage Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Track and manage passenger baggage across all flights
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
              New Baggage
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
              <LuggageIcon sx={{ fontSize: 30, color: '#1976d2', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0d47a1' }}>
                {rows.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Total Baggage Items
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
              <FlightTakeoffIcon sx={{ fontSize: 30, color: '#2e7d32', mb: 1, opacity: 0.8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                {flights.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', mt: 1, fontWeight: 500 }}>
                Active Flights
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
              placeholder="Search baggage..."
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
          title="Baggage Inventory"
          subheader={`${filteredRows.length} items found`}
          sx={{
            background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
            borderBottom: '1px solid #e0e0e0'
          }}
        />
        
        <CardContent sx={{ p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ 
              m: 3, 
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
            }}>
              {error}
            </Alert>
          )}
          
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
                  <TableCell>Tag ID</TableCell>
                  <TableCell>Flight</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Location</TableCell>
                  <TableCell>Created</TableCell>
                  {(canEdit || canDelete) && <TableCell align="center">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Loading baggage data...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={row._id} hover sx={{ '&:hover': { background: '#fafafa' } }}>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {row.tagId}
                      </TableCell>
                      <TableCell>
                        {row.flightId?.flightNo ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FlightTakeoffIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.flightId.flightNo}
                            </Typography>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {row.weight ? (
                          <Chip 
                            label={`${row.weight} kg`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontWeight: 500,
                              borderColor: alpha('#1976d2', 0.3),
                              color: 'text.primary'
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status || "checkin"} 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: statusColor(row.status).bg,
                            color: statusColor(row.status).text,
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        {row.lastLocation || "Not specified"}
                      </TableCell>
                      <TableCell>
                        {formatMaybeDate(row.createdAt)}
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            {canEdit && (
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small"
                                  onClick={() => setOpenEdit(row)}
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
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDelete(row._id)}
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
                      <LuggageIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        No baggage records found
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'No baggage has been added yet'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBaggageDialog 
        open={openCreate} 
        onClose={() => setOpenCreate(false)} 
        onSubmit={handleCreate}
        flights={flights}
      />
      
      {openEdit && (
        <EditBaggageDialog
          open={!!openEdit}
          record={openEdit}
          onClose={() => setOpenEdit(null)}
          onSubmit={(payload) => handleEdit(openEdit._id, payload)}
          flights={flights}
        />
      )}
    </Box>
  );
}

function statusColor(s) {
  switch (s) {
    case "loaded": return { bg: '#e3f2fd', text: '#1565c0' };
    case "intransit": return { bg: '#e8f5e9', text: '#2e7d32' };
    case "unloaded": return { bg: '#fff3e0', text: '#ef6c00' };
    case "atbelt": return { bg: '#f1f8e9', text: '#558b2f' };
    case "lost": return { bg: '#ffebee', text: '#c62828' };
    case "checkin":
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

function CreateBaggageDialog({ open, onClose, onSubmit, flights }) {
  const [tagId, setTagId] = useState("");
  const [flightId, setFlightId] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("");
  const [lastLocation, setLastLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!tagId.trim()) return "Tag ID is required";
    if (!/^[A-Za-z00-9]+$/.test(tagId)) return "Tag ID must be alphanumeric";
    if (!flightId) return "Flight is required";
    if (weight && (parseFloat(weight) < 0.1 || parseFloat(weight) > 100)) {
      return "Weight must be between 0.1–100 kg";
    }
    if (status && !BAGGAGE_STATUSES.includes(status)) return "Invalid status";
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        tagId: tagId.trim(),
        flightId,
        ...(weight && { weight: parseFloat(weight) }),
        ...(status && { status }),
        ...(lastLocation.trim() && { lastLocation: lastLocation.trim() })
      };
      
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setTagId("");
    setFlightId("");
    setWeight("");
    setStatus("");
    setLastLocation("");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" onExited={reset}>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
        color: 'white',
        fontWeight: 600
      }}>
        Create New Baggage
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField 
            label="Tag ID" 
            value={tagId} 
            onChange={(e) => setTagId(e.target.value)} 
            required 
            helperText="Alphanumeric characters only"
            disabled={submitting}
          />
          <TextField 
            label="Flight" 
            select 
            value={flightId} 
            onChange={(e) => setFlightId(e.target.value)} 
            required
            disabled={submitting}
          >
            <MenuItem value="">Select Flight</MenuItem>
            {flights.map(f => (
              <MenuItem key={f._id} value={f._id}>
                {f.flightNo} ({f.origin} → {f.destination})
              </MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Weight (kg)" 
            type="number" 
            value={weight} 
            onChange={(e) =>{setWeight(e.target.value)}}
            inputProps={{ min: 0.1, max: 100, step: 0.1 }}
            helperText="Optional: 0.1-100 kg"
            disabled={submitting}
          />
          <TextField 
            label="Status" 
            select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            disabled={submitting}
          >
            <MenuItem value="">(default: checkin)</MenuItem>
            {BAGGAGE_STATUSES.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Last Location" 
            value={lastLocation} 
            onChange={(e) => setLastLocation(e.target.value)}
            helperText="Optional"
            disabled={submitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={submitting}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditBaggageDialog({ open, onClose, onSubmit, record, flights }) {
  const [status, setStatus] = useState(record.status || "");
  const [lastLocation, setLastLocation] = useState(record.lastLocation || "");
  const [flightId, setFlightId] = useState(record.flightId?._id || record.flightId || "");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (status && !BAGGAGE_STATUSES.includes(status)) return "Invalid status";
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        ...(status && { status }),
        ...(lastLocation.trim() && { lastLocation: lastLocation.trim() }),
        ...(flightId && { flightId })
      };
      
      // Remove empty strings to avoid overwriting with empty values
      Object.keys(payload).forEach(key => {
        if (payload[key] === "") delete payload[key];
      });
      
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
        color: 'white',
        fontWeight: 600
      }}>
        Edit Baggage — {record.tagId}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField 
            label="Status" 
            select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            disabled={submitting}
          >
            <MenuItem value="">(leave unchanged)</MenuItem>
            {BAGGAGE_STATUSES.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Last Location" 
            value={lastLocation} 
            onChange={(e) => setLastLocation(e.target.value)}
            helperText="Current location of the baggage"
            disabled={submitting}
          />
          <TextField 
            label="Reassign to Flight" 
            select 
            value={flightId} 
            onChange={(e) => setFlightId(e.target.value)}
            helperText="Select a flight to reassign this baggage"
            disabled={submitting}
          >
            <MenuItem value="">(leave unchanged)</MenuItem>
            {flights.map(f => (
              <MenuItem key={f._id} value={f._id}>
                {f.flightNo} ({f.origin} → {f.destination})
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Current Details:</Typography>
            <Typography variant="body2">Tag ID: {record.tagId}</Typography>
            <Typography variant="body2">Flight: {record.flightId?.flightNo || record.flightId || "Not assigned"}</Typography>
            <Typography variant="body2">Weight: {record.weight || "Not specified"} kg</Typography>
            <Typography variant="body2">Created: {formatMaybeDate(record.createdAt)}</Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={submitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}