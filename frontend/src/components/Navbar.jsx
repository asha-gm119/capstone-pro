import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LuggageIcon from "@mui/icons-material/WorkOutline";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";

const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 80;

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const menuItems = [
    { text: "Flights", icon: <FlightTakeoffIcon />, path: "/flights", roles: ["admin", "airline"] },
    { text: "Baggage", icon: <LuggageIcon />, path: "/baggage", roles: ["admin", "baggage"] },
    { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["admin"] },
    { text: "Ops", icon: <WorkIcon />, path: "/ops", roles: ["admin", "airline"] },
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", roles: ["admin", "airline", "baggage"] },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          boxSizing: "border-box",
          borderRight: "none",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.6)",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          boxShadow: "4px 0 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(45deg, #1976d2, #00bcd4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AeroFlow
          </Typography>
        )}
        <IconButton size="small" onClick={toggleCollapse}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider sx={{ opacity: 0.4 }} />

      {/* User Info */}
      {!collapsed && user && (
        <Box sx={{ px: 2, pb: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {user?.name }
          </Typography>
          <Chip
            label={user.role}
            size="small"
            sx={{
              background: "rgba(25, 118, 210, 0.1)",
              color: "#1976d2",
              textTransform: "capitalize",
              fontSize: "0.75rem",
            }}
          />
        </Box>
      )}

      {/* Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {filteredItems.map((item) => {
          const isActive = loc.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip title={collapsed ? item.text : ""} placement="right">
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    my: 0.5,
                    mx: 1,
                    borderRadius: 2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 0 : 2,
                    py: 1.2,
                    background: isActive ? "rgba(25, 118, 210, 0.15)" : "transparent",
                    borderLeft: isActive ? "4px solid #1976d2" : "4px solid transparent",
                    "&:hover": {
                      background: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? "auto" : 40,
                      color: isActive ? "#1976d2" : "#444",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "50%",
                        background: isActive ? "rgba(25, 118, 210, 0.2)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  {!collapsed && (
                    <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: "0.9rem" }}>
                      {item.text}
                    </Typography>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ mb: 2 }}>
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 0 : 2,
              py: 1.2,
              color: "#d32f2f",
              "&:hover": { background: "rgba(211, 47, 47, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 40, justifyContent: "center", color: "#d32f2f" }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && <Typography>Logout</Typography>}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
