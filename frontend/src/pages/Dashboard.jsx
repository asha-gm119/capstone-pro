// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  FlightTakeoff,
  Luggage,
  Warning,
  Schedule,
  CheckCircle,
  Error,
  Refresh,
  Memory,
  Storage,
} from "@mui/icons-material";
import {
  getOverview,
  getActiveFlights,
  getNotifications,
  getFlightStats,
  getBaggageOverview,
  getSystemHealth,
} from "../api.js";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export default function DashboardPage() {
  const theme = useTheme();
  const [overview, setOverview] = useState(null);
  const [activeFlights, setActiveFlights] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [flightStats, setFlightStats] = useState(null);
  const [baggageOverview, setBaggageOverview] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [
        overviewRes,
        activeFlightsRes,
        notificationsRes,
        flightStatsRes,
        baggageOverviewRes,
        systemHealthRes,
      ] = await Promise.all([
        getOverview(),
        getActiveFlights(),
        getNotifications(10),
        getFlightStats(),
        getBaggageOverview(),
        getSystemHealth(),
      ]);

      setOverview(overviewRes.data);
      setActiveFlights(activeFlightsRes.data);
      setNotifications(notificationsRes.data);
      setFlightStats(flightStatsRes.data);
      setBaggageOverview(baggageOverviewRes.data);
      setSystemHealth(systemHealthRes.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case "on-time":
        return <Chip label="On-Time" color="success" size="small" />;
      case "delayed":
        return <Chip label="Delayed" color="warning" size="small" />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle sx={{ color: "#2e7d32" }} />;
      case "degraded":
        return <Warning sx={{ color: "#ed6c02" }} />;
      default:
        return <Error sx={{ color: "#d32f2f" }} />;
    }
  };

  // Chart Data
  const flightStatusData = {
    labels: flightStats?.byStatus ? Object.keys(flightStats.byStatus) : [],
    datasets: [
      {
        label: "Flights",
        data: flightStats?.byStatus ? Object.values(flightStats.byStatus) : [],
        backgroundColor: ["#64b5f6", "#81c784", "#ffb74d", "#e57373"],
      },
    ],
  };

  const baggageStatusData = {
    labels: baggageOverview?.byStatus ? Object.keys(baggageOverview.byStatus) : [],
    datasets: [
      {
        label: "Baggage Count",
        data: baggageOverview?.byStatus ? Object.values(baggageOverview.byStatus) : [],
        backgroundColor: "#90caf9",
      },
    ],
  };

  // Extra chart: monthly trends
  const monthlyFlightData = {
    labels: flightStats?.byMonth ? Object.keys(flightStats.byMonth) : [],
    datasets: [
      {
        label: "Flights per Month",
        data: flightStats?.byMonth ? Object.values(flightStats.byMonth) : [],
        backgroundColor: "#4db6ac",
      },
    ],
  };

  const cardStyle = {
    p: 2,
    borderRadius: 3,
    boxShadow: 3,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(6px)",
    height: "100%",
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f3f7fd 0%, #ffffff 100%)",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Operations Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Monitoring flights, baggage, and system performance
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Last updated at {lastUpdated}
            </Typography>
          )}
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadDashboardData}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={8} sx={{ flex: 1, px: 2, pb: 2 }}>
        {/* Overview Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              {
                title: "Total Flights",
                value: overview?.flights?.total || 0,
                icon: <FlightTakeoff sx={{ color: "#1976d2" }} />,
                bg: "#E3F2FD",
                color: "#1976d2",
              },
              {
                title: "Total Baggage",
                value: overview?.baggage?.total || 0,
                icon: <Luggage sx={{ color: "#2e7d32" }} />,
                bg: "#E8F5E9",
                color: "#2e7d32",
              },
              {
                title: "Active Flights",
                value: overview?.flights?.active || 0,
                icon: <Schedule sx={{ color: "#ef6c00" }} />,
                bg: "#FFF3E0",
                color: "#ef6c00",
              },
            ].map((item, i) => (
              <Grid key={i} item xs={12} md={3}>
                <Card sx={{ ...cardStyle, background: item.bg, color: item.color }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {item.icon}
                    <Typography variant="h4" fontWeight={700}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Typography>{item.title}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Active Flights */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyle}>
            <CardHeader title="Active Flights" />
            <CardContent
              sx={{
                flex: 1,
                overflow: "auto",
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {activeFlights?.flights?.map((f) => (
                <Card
                  key={f._id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    borderLeft: `6px solid ${
                      f.status === "on-time"
                        ? "#2e7d32"
                        : f.status === "delayed"
                        ? "#ed6c02"
                        : "#d32f2f"
                    }`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {f.flightNo}
                    </Typography>
                    {getStatusChip(f.status)}
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {f.origin} → {f.destination}
                  </Typography>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardHeader title="Notifications" />
            <CardContent sx={{ flex: 2, overflow: "auto" }}>
              {notifications?.notifications?.map((n, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{n.title}</Typography>
                  <Chip
                    label={n.message}
                    size="small"
                    color={
                      n.severity === "critical"
                        ? "error"
                        : n.severity === "high"
                        ? "warning"
                        : "info"
                    }
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardHeader title="Flight Statistics" />
            <CardContent>
              <Bar data={flightStatusData} options={{ responsive: true, indexAxis: "y" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardHeader title="Baggage Overview" />
            <CardContent>
              <Bar data={baggageStatusData} options={{ responsive: true, indexAxis: "y" }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardHeader title="Monthly Flight Trends" />
            <CardContent>
              <Bar data={monthlyFlightData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>

        {/* System Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="System Load" />
            <CardContent>
              <Typography variant="body2">CPU Usage</Typography>
              <LinearProgress variant="determinate" value={65} sx={{ mb: 2 }} />
              <Typography variant="body2">Memory Usage</Typography>
              <LinearProgress variant="determinate" value={45} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="Database Health" />
            <CardContent>
              <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                <Storage fontSize="small" color="primary" /> Connections Stable
              </Typography>
              <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                <Memory fontSize="small" color="secondary" /> Queries Optimized
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
