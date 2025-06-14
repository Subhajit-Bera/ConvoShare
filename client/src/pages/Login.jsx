// import React, { useState } from 'react'
// import {
//   Avatar,
//   Button,
//   Container,
//   IconButton,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { bgreen2, bgreen } from '../constants/color';

// import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
// import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
// import { usernameValidator } from "../utils/validators";
// import { useFileHandler } from "6pp";

// import axios from "axios";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { server } from "../constants/config";
// import { userExists } from "../redux/reducers/auth";

// const Login = () => {

//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const toggleLogin = () => setIsLogin((prev) => !prev);

//   const avatar = useFileHandler("single");
//   const dispatch = useDispatch();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // const toastId = toast.loading("Logging In...");

//     // setIsLoading(true);
//     const config = {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/login`,
//         {
//           username: username,
//           password: password
//         },
//         config
//       );
//       dispatch(userExists(data.user));
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     }
//   }

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("avatar", avatar.file);
//     formData.append("name", name);
//     formData.append("bio", bio);
//     formData.append("username", username);
//     formData.append("password", password);

//     const config = {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/new`,
//         formData,
//         config
//       );

//       dispatch(userExists(data.user));
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     }
//   }



//   return (
//     <div
//       style={{
//         backgroundImage: "linear-gradient(to right bottom, #91c788, #bcd097, #ddd9af, #f3e6cd, #fef5ed)"
//       }}
//     >
//       <Container
//         component={"main"}
//         maxWidth="xs"
//         sx={{
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             padding: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >

//           {isLogin ? (
//             <>
//               <Typography variant="h5">Login</Typography>
//               <form
//                 style={{
//                   width: "100%",
//                   marginTop: "1rem",
//                 }}
//                 onSubmit={handleLogin}

//               >
//                 <TextField
//                   required
//                   fullWidth
//                   label="Username"
//                   margin="normal"
//                   variant="outlined"
//                   value={username}
//                   color='success'
//                   onChange={(e) => setUsername(e.target.value)}
//                 />

//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   margin="normal"
//                   variant="outlined"
//                   value={password}
//                   color='success'
//                   onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <Button
//                   sx={{
//                     marginTop: "1rem",
//                     bgcolor: bgreen2,
//                     color: 'white',
//                     "&:hover": {
//                       bgcolor: bgreen,
//                     },
//                   }}
//                   variant="contained"
//                   type="submit"
//                   fullWidth

//                 >
//                   Login
//                 </Button>

//                 <Typography textAlign={"center"} m={"1rem"}>
//                   OR
//                 </Typography>

//                 <Button

//                   fullWidth
//                   sx={{
//                     color: "#4CAF50",
//                     "&:hover": {
//                       bgcolor: "#EBF3E8",
//                     },
//                   }}
//                   onClick={toggleLogin}
//                 >
//                   Sign Up Instead
//                 </Button>
//               </form>
//             </>
//           ) : (
//             <>
//               <Typography variant="h5">Sign Up</Typography>
//               <form
//                 style={{
//                   width: "100%",
//                   marginTop: "1rem",
//                 }}
//                 onSubmit={handleSignUp}

//               >
//                 <Stack position={"relative"} width={"10rem"} margin={"auto"}>
//                   <Avatar
//                     sx={{
//                       width: "10rem",
//                       height: "10rem",
//                       objectFit: "contain",
//                     }}
//                     src={avatar.preview}
//                   />

//                   <IconButton
//                     sx={{
//                       position: "absolute",
//                       bottom: "0",
//                       right: "0",
//                       color: "white",
//                       bgcolor: "rgba(0,0,0,0.5)",
//                       ":hover": {
//                         bgcolor: "rgba(0,0,0,0.7)",
//                       },
//                     }}
//                     component="label"
//                   >
//                     <>
//                       <CameraAltIcon />
//                       <VisuallyHiddenInput  //Input tag for uploading pic
//                         type="file"
//                         onChange={avatar.changeHandler}
//                       />
//                     </>
//                   </IconButton>
//                 </Stack>

//                 {avatar.error && (
//                   <Typography
//                     m={"1rem auto"}
//                     width={"fit-content"}
//                     display={"block"}
//                     color="error"
//                     variant="caption"
//                   >
//                     {avatar.error}
//                   </Typography>
//                 )}

//                 <TextField
//                   required
//                   fullWidth
//                   label="Name"
//                   margin="normal"
//                   variant="outlined"
//                   color='success'
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />

//                 <TextField
//                   required
//                   fullWidth
//                   label="Bio"
//                   margin="normal"
//                   variant="outlined"
//                   color='success'
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                 />
//                 <TextField
//                   required
//                   fullWidth
//                   label="Username"
//                   margin="normal"
//                   variant="outlined"
//                   color='success'
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />

//                 {usernameValidator(username) && (
//                   <Typography color="error" variant="caption">
//                     Username is Invalid
//                   </Typography>
//                 )}

//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   margin="normal"
//                   variant="outlined"
//                   color='success'
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <Button
//                   sx={{
//                     marginTop: "1rem",
//                     bgcolor: bgreen2,
//                     color: 'white',
//                     "&:hover": {
//                       bgcolor: bgreen,
//                     },
//                   }}
//                   variant="contained"
//                   type="submit"
//                   fullWidth

//                 >
//                   Sign Up
//                 </Button>

//                 <Typography textAlign={"center"}>
//                   OR
//                 </Typography>

//                 <Button

//                   fullWidth
//                   sx={{
//                     color: "#4CAF50",
//                     "&:hover": {
//                       bgcolor: "#EBF3E8",
//                     },
//                   }}
//                   onClick={toggleLogin}
//                 >
//                   Login Instead
//                 </Button>
//               </form>
//             </>
//           )}

//         </Paper>


//       </Container>
//     </div>
//   )
// }

// export default Login

// import React, { useState, useEffect } from 'react';
// import {
//   Avatar,
//   Button,
//   Container,
//   IconButton,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
//   Box,
//   Grid,
// } from "@mui/material";
// import { bgreen2, bgreen } from '../constants/color';
// import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
// import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
// import { usernameValidator, validateEmail } from "../utils/validators";
// import { useFileHandler } from "6pp";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { server } from "../constants/config";
// import { userExists } from "../redux/reducers/auth";
// import convoshareImg from "../assets/convoshareImg.jpg";

// const Login = () => {
//   const [view, setView] = useState("login"); // login, signup, forgot-password
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isValidEmail, setIsValidEmail] = useState(false);
//   const [timer, setTimer] = useState(0); // Timer in seconds
//   const [isButtonDisabled, setIsButtonDisabled] = useState(false);

//   const avatar = useFileHandler("single");
//   const dispatch = useDispatch();

//   // Handle email change and validate
//   const handleEmailChange = (e) => {
//     const newEmail = e.target.value;
//     setEmail(newEmail);
//     setIsValidEmail(validateEmail(newEmail));
//   };

//   // Timer effect for countdown
//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             setIsButtonDisabled(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Format timer as MM:SS
//   const formatTimer = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const config = {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/login`,
//         { username, password },
//         config
//       );
//       dispatch(userExists(data.user));
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("avatar", avatar.file);
//     formData.append("name", name);
//     formData.append("bio", bio);
//     formData.append("username", username);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("otp", otp);

//     const config = {
//       withCredentials: true,
//       headers: { "Content-Type": "multipart/form-data" },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/new`,
//         formData,
//         config
//       );
//       dispatch(userExists(data.user));
//       toast.success(data.message);
//       setView("login");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRequestResetLink = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const config = {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/request-reset-link`,
//         { email },
//         config
//       );
//       toast.success(data.message);
//       setView("login");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRequestSignupOTP = async () => {
//     setIsLoading(true);
//     const config = {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     };

//     try {
//       const { data } = await axios.post(
//         `${server}/api/v1/user/request-otp`,
//         { email },
//         config
//       );
//       toast.success(data.message);
//       // Disable button and start timer for 5 minutes (300 seconds)
//       setIsButtonDisabled(true);
//       setTimer(300);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something Went Wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: '100vw',
//         display: "flex",
//         flexDirection: "row",
//       }}
//     >
//       {/* Left Side: Image */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "#f5f5f5",
//           width: "50%",
//           // padding: 2,
//         }}
//       >
//         <img
//           src={convoshareImg}
//           alt="ConvoShare Image"
//           style={{
//             width: "100%",
//             height: "100vh",
//             objectFit: "cover",
//             // borderRadius: "8px",
//           }}
//         />
//       </Box>

//       {/* Right Side: Form */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: { xs: 2, md: 4 },
//           width: "50%",
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             padding: 4,
//             width: "100%",
//             maxWidth: "600px",
//             maxHeight: "90vh",
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             borderRadius: "8px",
//           }}
//         >
//           {view === "login" ? (
//             <>
//               <Typography variant="h5">Login</Typography>
//               <form
//                 style={{ width: "100%", marginTop: "1rem" }}
//                 onSubmit={handleLogin}
//               >
//                 <TextField
//                   required
//                   fullWidth
//                   label="Username"
//                   margin="normal"
//                   variant="outlined"
//                   value={username}
//                   color="success"
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   margin="normal"
//                   variant="outlined"
//                   value={password}
//                   color="success"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Button
//                   fullWidth
//                   sx={{
//                     color: "#4CAF50",
//                     textDecoration: "underline",
//                     marginTop: "0.5rem",
//                     "&:hover": { bgcolor: "#EBF3E8" },
//                   }}
//                   onClick={() => setView("forgot-password")}
//                 >
//                   Forgot Password?
//                 </Button>
//                 <Button
//                   sx={{
//                     marginTop: "1rem",
//                     bgcolor: bgreen2,
//                     color: "white",
//                     "&:hover": { bgcolor: bgreen },
//                   }}
//                   variant="contained"
//                   type="submit"
//                   fullWidth
//                   disabled={isLoading}
//                 >
//                   Login
//                 </Button>
//                 <Typography textAlign={"center"} m={"1rem"}>
//                   OR
//                 </Typography>
//                 <Button
//                   fullWidth
//                   sx={{
//                     color: "#4CAF50",
//                     "&:hover": { bgcolor: "#EBF3E8" },
//                   }}
//                   onClick={() => setView("signup")}
//                 >
//                   Sign Up Instead
//                 </Button>
//               </form>
//             </>
//           ) : view === "signup" ? (
//             <>
//               <Typography variant="h5">Sign Up</Typography>
//               <form
//                 style={{ width: "100%", marginTop: "1rem" }}
//                 onSubmit={handleSignUp}
//               >
//                 {/* Avatar Row */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//                   <Stack position={"relative"} width={"10rem"}>
//                     <Avatar
//                       sx={{ width: "10rem", height: "10rem", objectFit: "contain" }}
//                       src={avatar.preview}
//                     />
//                     <IconButton
//                       sx={{
//                         position: "absolute",
//                         bottom: "0",
//                         right: "0",
//                         color: "white",
//                         bgcolor: "rgba(0,0,0,0.5)",
//                         ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
//                       }}
//                       component="label"
//                     >
//                       <>
//                         <CameraAltIcon />
//                         <VisuallyHiddenInput
//                           type="file"
//                           onChange={avatar.changeHandler}
//                         />
//                       </>
//                     </IconButton>
//                   </Stack>
//                 </Box>
//                 {avatar.error && (
//                   <Typography
//                     m={"1rem auto"}
//                     width={"fit-content"}
//                     display={"block"}
//                     color="error"
//                     variant="caption"
//                   >
//                     {avatar.error}
//                   </Typography>
//                 )}
//                 {/* Form Fields in 2 Columns */}
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="Name"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="Bio"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={bio}
//                       onChange={(e) => setBio(e.target.value)}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="Username"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                     />
//                     {usernameValidator(username) && (
//                       <Typography color="error" variant="caption">
//                         Username is Invalid
//                       </Typography>
//                     )}
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="Email"
//                       type="email"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={email}
//                       onChange={handleEmailChange}
//                     />
//                   </Grid>
//                   {isValidEmail && (
//                     <Grid item xs={12}>
//                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
//                         <Button
//                           sx={{
//                             bgcolor: bgreen2,
//                             color: "white",
//                             "&:hover": { bgcolor: bgreen },
//                           }}
//                           variant="contained"
//                           onClick={handleRequestSignupOTP}
//                           disabled={isLoading || !email || isButtonDisabled}
//                         >
//                           Verify Email
//                         </Button>
//                         {timer > 0 && (
//                           <Typography variant="body2" ml={2} color="textSecondary">
//                             Resend in {formatTimer(timer)}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Grid>
//                   )}
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="OTP"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       required
//                       fullWidth
//                       label="Password"
//                       type="password"
//                       margin="normal"
//                       variant="outlined"
//                       color="success"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </Grid>
//                 </Grid>
//                 {/* Sign Up Button Row */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                   <Button
//                     sx={{
//                       width: "50%",
//                       bgcolor: bgreen2,
//                       color: "white",
//                       "&:hover": { bgcolor: bgreen },
//                     }}
//                     variant="contained"
//                     type="submit"
//                     disabled={isLoading}
//                   >
//                     Sign Up
//                   </Button>
//                 </Box>
//                 {/* OR Row */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                   <Typography textAlign={"center"}>
//                     OR
//                   </Typography>
//                 </Box>
//                 {/* Login Instead Row */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                   <Button
//                     sx={{
//                       width: "50%",
//                       color: "#4CAF50",
//                       "&:hover": { bgcolor: "#EBF3E8" },
//                     }}
//                     onClick={() => setView("login")}
//                   >
//                     Login Instead
//                   </Button>
//                 </Box>
//               </form>
//             </>
//           ) : (
//             <>
//               <Typography variant="h5">Forgot Password</Typography>
//               <form
//                 style={{ width: "100%", marginTop: "1rem" }}
//                 onSubmit={handleRequestResetLink}
//               >
//                 <TextField
//                   required
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   margin="normal"
//                   variant="outlined"
//                   color="success"
//                   value={email}
//                   onChange={handleEmailChange}
//                 />
//                 <Button
//                   sx={{
//                     marginTop: "1rem",
//                     bgcolor: bgreen2,
//                     color: "white",
//                     "&:hover": { bgcolor: bgreen },
//                   }}
//                   variant="contained"
//                   type="submit"
//                   fullWidth
//                   disabled={isLoading || !email || !isValidEmail}
//                 >
//                   Send Reset Link
//                 </Button>
//                 <Typography textAlign={"center"} m={"1rem"}>
//                   OR
//                 </Typography>
//                 <Button
//                   fullWidth
//                   sx={{
//                     color: "#4CAF50",
//                     "&:hover": { bgcolor: "#EBF3E8" },
//                   }}
//                   onClick={() => setView("login")}
//                 >
//                   Back to Login
//                 </Button>
//               </form>
//             </>
//           )}
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import { bgreen2, bgreen } from '../constants/color';
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { usernameValidator, validateEmail } from "../utils/validators";
import { useFileHandler } from "6pp";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import convoshareImg from "../assets/convoshareImg.jpg";

const Login = () => {
  const [view, setView] = useState("login"); // login, signup, forgot-password
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  // Handle email change and validate
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  // Timer effect for countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username, password },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("otp", otp);

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
      setView("login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResetLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/request-reset-link`,
        { email },
        config
      );
      toast.success(data.message);
      setView("login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSignupOTP = async () => {
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/request-otp`,
        { email },
        config
      );
      toast.success(data.message);
      // Disable button and start timer for 5 minutes (300 seconds)
      setIsButtonDisabled(true);
      setTimer(300);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stack vertically on mobile, row on desktop
      }}
    >
      {/* Left Side: Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", sm: "flex" }, // Hide on xs, show on sm and up
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          width: { xs: "100%", md: "50%" }, // Full width on mobile, 50% on desktop
          height: { xs: "30vh", sm: "50vh", md: "100vh" }, // Adjust height for mobile
        }}
      >
        <img
          src={convoshareImg}
          alt="ConvoShare Image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Right Side: Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, md: 4 },
          width: { xs: "100%", md: "50%" }, // Full width on mobile, 50% on desktop
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, sm: 4 }, // Reduce padding on mobile
            width: "100%",
            maxWidth: { xs: "100%", sm: "500px", md: "600px" }, // Adjust width based on screen size
            maxHeight: { xs: "80vh", sm: "85vh", md: "90vh" }, // Slightly smaller on mobile
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
          }}
        >
          {view === "login" ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username}
                  color="success"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password}
                  color="success"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  fullWidth
                  sx={{
                    color: "#4CAF50",
                    textDecoration: "underline",
                    marginTop: "0.5rem",
                    "&:hover": { bgcolor: "#EBF3E8" },
                  }}
                  onClick={() => setView("forgot-password")}
                >
                  Forgot Password?
                </Button>
                <Button
                  sx={{
                    marginTop: "1rem",
                    bgcolor: bgreen2,
                    color: "white",
                    "&:hover": { bgcolor: bgreen },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>
                <Button
                  fullWidth
                  sx={{
                    color: "#4CAF50",
                    "&:hover": { bgcolor: "#EBF3E8" },
                  }}
                  onClick={() => setView("signup")}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : view === "signup" ? (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleSignUp}
              >
                {/* Avatar Row */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Stack position={"relative"} width={"10rem"}>
                    <Avatar
                      sx={{ width: "10rem", height: "10rem", objectFit: "contain" }}
                      src={avatar.preview}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.5)",
                        ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                      component="label"
                    >
                      <>
                        <CameraAltIcon />
                        <VisuallyHiddenInput
                          type="file"
                          onChange={avatar.changeHandler}
                        />
                      </>
                    </IconButton>
                  </Stack>
                </Box>
                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                {/* Form Fields in Responsive Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Bio"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameValidator(username) && (
                      <Typography color="error" variant="caption">
                        Username is Invalid
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      type="email"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </Grid>
                  {isValidEmail && (
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                        <Button
                          sx={{
                            bgcolor: bgreen2,
                            color: "white",
                            "&:hover": { bgcolor: bgreen },
                          }}
                          variant="contained"
                          onClick={handleRequestSignupOTP}
                          disabled={isLoading || !email || isButtonDisabled}
                        >
                          Verify Email
                        </Button>
                        {timer > 0 && (
                          <Typography variant="body2" ml={2} color="textSecondary">
                            Resend in {formatTimer(timer)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="OTP"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      margin="normal"
                      variant="outlined"
                      color="success"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
                {/* Sign Up Button Row */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    sx={{
                      width: { xs: "100%", sm: "50%" }, // Full width on mobile
                      bgcolor: bgreen2,
                      color: "white",
                      "&:hover": { bgcolor: bgreen },
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                  >
                    Sign Up
                  </Button>
                </Box>
                {/* OR Row */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Typography textAlign={"center"}>
                    OR
                  </Typography>
                </Box>
                {/* Login Instead Row */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    sx={{
                      width: { xs: "100%", sm: "50%" }, // Full width on mobile
                      color: "#4CAF50",
                      "&:hover": { bgcolor: "#EBF3E8" },
                    }}
                    onClick={() => setView("login")}
                  >
                    Login Instead
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Forgot Password</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleRequestResetLink}
              >
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  variant="outlined"
                  color="success"
                  value={email}
                  onChange={handleEmailChange}
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                    bgcolor: bgreen2,
                    color: "white",
                    "&:hover": { bgcolor: bgreen },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading || !email || !isValidEmail}
                >
                  Send Reset Link
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>
                <Button
                  fullWidth
                  sx={{
                    color: "#4CAF50",
                    "&:hover": { bgcolor: "#EBF3E8" },
                  }}
                  onClick={() => setView("login")}
                >
                  Back to Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;