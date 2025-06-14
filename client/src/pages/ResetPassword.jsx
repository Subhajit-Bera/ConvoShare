import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { bgreen2, bgreen } from '../constants/color';
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../constants/config";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/reset-password/${token}`,
                { password },
                config
            );
            toast.success(data.message);
            navigate("/");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: "linear-gradient(to right bottom, #91c7f8, #bcd0f7, #ddd9af, #e3e6cd, #ffffff)"
            }}
        >
            <Container
                component="main"
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
                    <Typography variant="h5">Reset Password</Typography>
                    <form
                        style={{ width: "100%", marginTop: "1rem" }}
                        onSubmit={handleResetPassword}
                    >
                        <TextField
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            color="success"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            disabled={isLoading || !password}
                        >
                            Reset Password
                        </Button>
                        <Typography textAlign="center" m={"1rem"}>
                            OR
                        </Typography>
                        <Button
                            fullWidth
                            sx={{
                                color: "#4CAF50",
                                "&:hover": { bgcolor: "#EBF3E8" },
                            }}
                            onClick={() => navigate("/")}
                        >
                            Back to Login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default ResetPassword;