import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { bgreen2, bgreen } from '../constants/color';

import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { usernameValidator } from "../utils/validators";
import { useFileHandler } from "6pp";

import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";

const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toggleLogin = () => setIsLogin((prev) => !prev);

  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    // const toastId = toast.loading("Logging In...");

    // setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username,
          password: password
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("username", username);
    formData.append("password", password);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  }



  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right bottom, #91c788, #bcd097, #ddd9af, #f3e6cd, #fef5ed)"
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}

              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username}
                  color='success'
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
                  color='success'
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                    bgcolor: bgreen2,
                    color: 'white',
                    "&:hover": {
                      bgcolor: bgreen,
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth

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
                    "&:hover": {
                      bgcolor: "#EBF3E8",
                    },
                  }}
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}

              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput  //Input tag for uploading pic
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

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

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  color='success'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  color='success'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  color='success'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                {usernameValidator(username) && (
                  <Typography color="error" variant="caption">
                    Username is Invalid
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  color='success'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                    bgcolor: bgreen2,
                    color: 'white',
                    "&:hover": {
                      bgcolor: bgreen,
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth

                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"}>
                  OR
                </Typography>

                <Button

                  fullWidth
                  sx={{
                    color: "#4CAF50",
                    "&:hover": {
                      bgcolor: "#EBF3E8",
                    },
                  }}
                  onClick={toggleLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}

        </Paper>


      </Container>
    </div>
  )
}

export default Login
