// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Stack,
//   Typography,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import { loginApi } from "../api.js";
// import { useAuth } from "../auth.jsx";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function Login() {
//   const { login } = useAuth();
//   const nav = useNavigate();
//   const loc = useLocation();
//   const from = loc.state?.from?.pathname || "/";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   async function onSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const { data } = await loginApi(email, password);
//       login(data.token, data.role, data.name);
//       toast.success("Welcome!");
//       nav(from, { replace: true });
//     } catch (e) {
//       // handled by interceptor
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Poppins', sans-serif",
//         backgroundColor: "#00A2FF",
//       }}
//     >
//       {/* Animated gradient background */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 0,
//           pointerEvents: "none", // This prevents the canvas from blocking clicks
//         }}
//       >
//         <canvas
//           ref={(canvas) => {
//             if (canvas && !canvas.hasAttribute('data-initialized')) {
//               canvas.setAttribute('data-initialized', 'true');
              
//               const ctx = canvas.getContext('2d');
//               const resizeCanvas = () => {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight;
//               };
              
//               resizeCanvas();
//               window.addEventListener('resize', resizeCanvas);
              
//               const colors = [
//                 '#FFFFFF',
//                 '#0c0a07ff', 
//                 '#D5ECEB',
//                 '#834545ff',
//                 '#D5ECEB'
//               ];
              
//               let time = 0;
//               const speed = 4;
//               const waveFreqX = 4;
//               const waveFreqY = 3;
//               const amplitude = 2;
              
//               const animate = () => {
//                 time += speed * 0.01;
                
//                 const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                
//                 colors.forEach((color, index) => {
//                   const offset = (index / (colors.length - 1)) + Math.sin(time + index) * 0.1;
//                   gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
//                 });
                
//                 ctx.fillStyle = gradient;
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
                
//                 // Add wave effect
//                 const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//                 const data = imageData.data;
                
//                 for (let y = 0; y < canvas.height; y += 2) {
//                   for (let x = 0; x < canvas.width; x += 2) {
//                     const waveX = Math.sin((x / canvas.width) * waveFreqX + time) * amplitude;
//                     const waveY = Math.sin((y / canvas.height) * waveFreqY + time) * amplitude;
                    
//                     const index = (y * canvas.width + x) * 4;
//                     if (data[index] !== undefined) {
//                       data[index] = Math.min(255, data[index] + waveX + waveY); // R
//                       data[index + 1] = Math.min(255, data[index + 1] + waveX); // G  
//                       data[index + 2] = Math.min(255, data[index + 2] + waveY); // B
//                     }
//                   }
//                 }
                
//                 ctx.putImageData(imageData, 0, 0);
//                 requestAnimationFrame(animate);
//               };
              
//               animate();
//             }
//           }}
//           style={{
//             width: '100%',
//             height: '100%',
//             opacity: 0.8,
//             pointerEvents: "none", // This also prevents canvas from blocking clicks
//           }}
//         />
//       </Box>

//       {/* Sky background overlay with clouds effect */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: `
//             radial-gradient(ellipse at 20% 80%, rgba(250, 250, 250, 0.2) 0%, transparent 50%),
//             radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
//             radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)
//           `,
//           zIndex: 1,
//           pointerEvents: "none", // This prevents the overlay from blocking clicks
//         }}
//       />

//       {/* Airplane wing illustration */}
//       <motion.div
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 1.2, ease: "easeOut" }}
//         style={{
//           position: "absolute",
//           bottom: 0,
//           right: 0,
//           width: "60%",
//           height: "40%",
//           background: "linear-gradient(45deg, #2C3E50 0%, #34495E 100%)",
//           clipPath: "polygon(0% 100%, 100% 60%, 100% 100%)",
//           zIndex: 1,
//           pointerEvents: "none", // This prevents the wing from blocking clicks
//         }}
//       />

//       {/* Wing details */}
//       <motion.div
//         initial={{ x: -50, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
//         style={{
//           position: "absolute",
//           bottom: 0,
//           right: "10%",
//           width: "40%",
//           height: "25%",
//           background: "linear-gradient(45deg, #34495E 0%, #5D6D7E 100%)",
//           clipPath: "polygon(0% 100%, 100% 70%, 100% 100%)",
//           zIndex: 2,
//           pointerEvents: "none", // This prevents the wing detail from blocking clicks
//         }}
//       />

//       {/* Main content container */}
//       <Stack
//         direction="row"
//         sx={{
//           width: "100%",
//           maxWidth: 1200,
//           height: "100vh",
//           position: "relative",
//           zIndex: 10, // Higher z-index to ensure it's above background elements
//         }}
//       >
//         {/* Left side - Welcome text */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "flex-end",
//             pr: 8,
//             color: "white",
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, delay: 0.3 }}
//           >
//             <Typography
//               variant="h2"
//               sx={{
//                 fontWeight: 300,
//                 mb: 1,
//                 textAlign: "right",
//                 textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//               }}
//             >
//               Fly high,
//             </Typography>
//             <Typography
//               variant="h2"
//               sx={{
//                 fontWeight: 700,
//                 mb: 2,
//                 textAlign: "right",
//                 textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//               }}
//             >
//               above the sky.
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 textAlign: "right",
//                 opacity: 0.9,
//                 textShadow: "0 1px 2px rgba(0,0,0,0.2)",
//               }}
//             >
//               connecting dreams to destinations
//             </Typography>
//           </motion.div>
//         </Box>

//         {/* Right side - Login form */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-start",
//             pl: 8,
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 40 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
//             whileHover={{ scale: 1.02 }}
//           >
//             <Card
//               elevation={0}
//               sx={{
//                 width: 380,
//                 borderRadius: 3,
//                 background: "rgba(255, 255, 255, 0.95)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(255, 255, 255, 0.2)",
//                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
//                 position: "relative",
//                 zIndex: 11, // Even higher z-index for the form
//               }}
//             >
//               <CardHeader
//                 sx={{ pb: 1 }}
//                 title={
//                   <Box sx={{ textAlign: "center", mb: 2 }}>
//                     {/* Skyair logo/icon */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mb: 2,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: 32,
//                           height: 32,
//                           background: "linear-gradient(45deg, #667eea, #764ba2)",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           mr: 1,
//                         }}
//                       >
//                         <Typography sx={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>
//                           ✈
//                         </Typography>
//                       </Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 600,
//                           color: "#2C3E50",
//                         }}
//                       >
//                         GrayMatter
//                       </Typography>
//                     </Box>
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 500,
//                         color: "#2C3E50",
//                         mb: 1,
//                       }}
//                     >
//                       Login
//                     </Typography>
//                   </Box>
//                 }
//               />
//               <CardContent sx={{ pt: 0 }}>
//                 <form onSubmit={onSubmit}>
//                   <Stack spacing={3}>
//                     <TextField
//                       label="Email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       autoFocus
//                       fullWidth
//                       variant="outlined"
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                           "& fieldset": {
//                             borderColor: "rgba(0, 0, 0, 0.12)",
//                           },
//                           "&:hover fieldset": {
//                             borderColor: "#667eea",
//                           },
//                           "&.Mui-focused fieldset": {
//                             borderColor: "#667eea",
//                           },
//                         },
//                         "& .MuiInputLabel-root": {
//                           fontSize: "0.875rem",
//                           fontWeight: 500,
//                           "&.Mui-focused": {
//                             color: "#667eea",
//                           },
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Password"
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       fullWidth
//                       variant="outlined"
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                           "& fieldset": {
//                             borderColor: "rgba(0, 0, 0, 0.12)",
//                           },
//                           "&:hover fieldset": {
//                             borderColor: "#667eea",
//                           },
//                           "&.Mui-focused fieldset": {
//                             borderColor: "#667eea",
//                           },
//                         },
//                         "& .MuiInputLabel-root": {
//                           fontSize: "0.875rem",
//                           fontWeight: 500,
//                           "&.Mui-focused": {
//                             color: "#667eea",
//                           },
//                         },
//                       }}
//                     />

//                     <Button
//                       type="submit"
//                       variant="contained"
//                       disabled={submitting}
//                       fullWidth
//                       sx={{
//                         py: 1.5,
//                         fontWeight: 600,
//                         fontSize: "1rem",
//                         borderRadius: 6,
//                         background: "linear-gradient(90deg, #4A90E2, #357ABD)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.5px",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           background: "linear-gradient(90deg, #357ABD, #2E6DA4)",
//                           transform: "translateY(-1px)",
//                           boxShadow: "0 4px 12px rgba(74, 144, 226, 0.4)",
//                         },
//                         "&:disabled": {
//                           background: "rgba(0, 0, 0, 0.12)",
//                         },
//                       }}
//                     >
//                       {submitting ? (
//                         <CircularProgress size={24} sx={{ color: "white" }} />
//                       ) : (
//                         "LOG IN "
//                       )}
//                     </Button>

//                     {/* Additional info section */}
//                     <Box
//                       sx={{
//                         mt: 3,
//                         p: 2,
//                         borderRadius: 2,
//                         background: "rgba(74, 144, 226, 0.1)",
//                         border: "1px solid rgba(74, 144, 226, 0.2)",
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#4A90E2",
//                           fontWeight: 500,
//                           mb: 1,
//                           display: "flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Box
//                           component="span"
//                           sx={{
//                             width: 16,
//                             height: 16,
//                             borderRadius: "50%",
//                             background: "#4A90E2",
//                             mr: 1,
//                             flexShrink: 0,
//                           }}
//                         />
//                         For Registration
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#666",
//                           fontSize: "0.75rem",
//                           lineHeight: 1.4,
//                         }}
//                       >
//                         Registration is disabled for non-admin users.Please contact admins for user registration
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </form>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </Box>
//       </Stack>

//       {/* Bottom copyright */}
//       <Box
//         sx={{
//           position: "absolute",
//           bottom: 16,
//           left: 16,
//           color: "rgba(255, 255, 255, 0.7)",
//           fontSize: "0.75rem",
//           zIndex: 4,
//         }}
//       >
//         legal notice | © 2006 GrayMatter
//       </Box>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from "@mui/material";
import { loginApi, registerApi } from "../api.js";
import { useAuth } from "../auth.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  PersonOutline, 
  LockOutlined, 
  EmailOutlined,
  FlightTakeoff,
  ArrowBack,
  LocationOn,
  Security,
  Luggage
} from "@mui/icons-material";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "airline"
  });
  const [submitting, setSubmitting] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimate(true);
  },[]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "airline"
    });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isSignUp) {
        // Registration logic
        const { data } = await registerApi(formData);
        toast.success("Account created successfully!");
        setIsSignUp(false); // Switch to login after successful registration
      } else {
        // Login logic
        const { data } = await loginApi(formData.email, formData.password);
        login(data.token, data.role, data.name);
        toast.success("Welcome!");
        nav(from, { replace: true });
      }
    } catch (e) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#0B3C5D",
        backgroundImage: "linear-gradient(135deg, #0B3C5D 0%, #1D2731 100%)",
        position: "relative",
        overflow: "hidden",
        padding: 2
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          right: "5%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 8s ease-in-out infinite",
          opacity: animate ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "floatReverse 10s ease-in-out infinite",
          opacity: animate ? 1 : 0,
          transition: "opacity 1.5s ease-in-out 0.3s",
        }}
      />

      {/* Animated Airplane */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "5%",
          fontSize: "60px",
          opacity: 0.1,
          animation: "fly 20s linear infinite",
        }}
      >
        ✈
      </Box>

      {/* Main content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1100px",
          zIndex: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
        }}
      >
        {/* Left side - Branding and quote */}
        <Box
          sx={{
            flex: 1,
            color: "white",
            textAlign: { xs: "center", md: "left" },
            padding: { xs: 2, md: 4 },
            opacity: animate ? 1 : 0,
            transform: animate ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s"
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: { xs: "center", md: "flex-start" }, 
            mb: 3,
            animation: "pulse 2s infinite",
          }}>
            <FlightTakeoff sx={{ fontSize: 48, color: "#FFB300", mr: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 700, color: "white" }}>
              AeroFlow
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFB300", mb: 2 }}>
            Airport Management System
          </Typography>
          
          <Box sx={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            borderRadius: 3, 
            padding: 3, 
            mb: 4,
            borderLeft: "4px solid #FFB300",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s"
          }}>
            <Typography variant="h6" sx={{ fontStyle: "italic", mb: 1 }}>
              "Streamlining aviation operations with seamless efficiency"
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Managing flights, baggage, and security systems
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Simple and efficient airport management
            </Typography>
          </Box>
          
          {/* Feature icons */}
          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 3, 
            justifyContent: { xs: "center", md: "flex-start" },
            opacity: animate ? 1 : 0,
            transform: animate ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.8s ease-out 0.7s, transform 0.8s ease-out 0.7s"
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ fontSize: 30, color: "#FFB300", mr: 1 }} />
              <Typography variant="body2">Flight Tracking</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Luggage sx={{ fontSize: 30, color: "#FFB300", mr: 1 }} />
              <Typography variant="body2">Baggage Management</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Security sx={{ fontSize: 30, color: "#FFB300", mr: 1 }} />
              <Typography variant="body2">Security Systems</Typography>
            </Box>
          </Box>
        </Box>

        {/* Right side - Login/Signup Card */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "450px",
            width: "100%",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateX(0)" : "translateX(20px)",
            transition: "opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s"
          }}
        >
          <Card 
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: "visible",
              background: "white",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              animation: "cardFloat 6s ease-in-out infinite",
            }}
          >
            <CardContent sx={{ p: 4, position: "relative" }}>
              {/* Back button for signup form */}
              {isSignUp && (
                <Button
                  startIcon={<ArrowBack />}
                  onClick={toggleForm}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    color: "text.secondary",
                    textTransform: "none",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateX(-5px)"
                    }
                  }}
                >
                  Back to Login
                </Button>
              )}

              {/* Decorative element */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 5px 15px rgba(74, 144, 226, 0.4)",
                  animation: "iconPulse 2s infinite",
                }}
              >
                {isSignUp ? (
                  <PersonOutline sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <FlightTakeoff sx={{ fontSize: 30, color: "white" }} />
                )}
              </Box>

              <Box sx={{ textAlign: "center", mb: 4, mt: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                  {isSignUp ? "Create Account" : "Secure Login"}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {isSignUp ? "Register for AeroFlow system access" : "Sign in to your AeroFlow account"}
                </Typography>
              </Box>

              <form onSubmit={onSubmit}>
                <Stack spacing={3}>
                  {isSignUp && (
                    <TextField
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={isSignUp}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <PersonOutline sx={{ color: "text.secondary", mr: 1 }} />
                      }}
                      sx={{
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                        }
                      }}
                    />
                  )}
                  
                  <TextField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <EmailOutlined sx={{ color: "text.secondary", mr: 1 }} />
                    }}
                    sx={{
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                      }
                    }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <LockOutlined sx={{ color: "text.secondary", mr: 1 }} />
                    }}
                    sx={{
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                      }
                    }}
                  />

                  {isSignUp && (
                    <FormControl fullWidth>
                      <InputLabel>System Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="System Role"
                        required={isSignUp}
                        sx={{
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                          }
                        }}
                      >
                        <MenuItem value="admin">Administrator</MenuItem>
                        <MenuItem value="airline">Airline Staff</MenuItem>
                        <MenuItem value="baggage">Baggage Handler</MenuItem>
                        
                      </Select>
                    </FormControl>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: "1rem",
                      borderRadius: 2,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
                      boxShadow: "0 4px 12px rgba(74, 144, 226, 0.4)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(74, 144, 226, 0.5)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        backgroundColor: "grey.300",
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      isSignUp ? "Create Account" : "Sign In"
                    )}
                  </Button>

                  {!isSignUp && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "primary.main", 
                        textAlign: "center", 
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        "&:hover": {
                          textDecoration: "underline",
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                      Forgot password?
                    </Typography>
                  )}
                </Stack>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {isSignUp ? "Already have an account?" : "Need AeroFlow system access?"}
                  <Typography 
                    component="span" 
                    onClick={toggleForm}
                    sx={{ 
                      color: "primary.main", 
                      ml: 1, 
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.3s",
                      "&:hover": {
                        textDecoration: "underline",
                        transform: "translateY(-2px)"
                      }
                    }}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
             
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes floatReverse {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes fly {
            0% { 
              transform: translateX(-100px) translateY(0px) rotate(30deg);
              opacity: 0;
            }
            10% { 
              transform: translateX(10%) translateY(20px) rotate(30deg);
              opacity: 0.1;
            }
            90% { 
              transform: translateX(90%) translateY(-20px) rotate(30deg);
              opacity: 0.1;
            }
            100% { 
              transform: translateX(110%) translateY(0px) rotate(30deg);
              opacity: 0;
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes cardFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes iconPulse {
            0% { box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4); }
            50% { box-shadow: 0 5px 20px rgba(74, 144, 226, 0.7); }
            100% { box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4); }
          }
        `}
      </style>
    </Box>
  );
}