import React, { useState } from 'react'
import {
    Box,
    Drawer,
    Grid,
    IconButton,
    Stack,
    Typography,
    styled,
} from "@mui/material";

import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Groups as GroupsIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
} from "@mui/icons-material";

import { grayColor, bgreen, bgc, bgreen2 } from '../../constants/color'
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";


const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />,
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupsIcon />,
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />,
    },
];


const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.77);
  }
`;

const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();

    const logoutHandler = () => {
        console.log("Logout")
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant="h5" textTransform={"uppercase"}>
                ConvoShare
            </Typography>

            <Stack spacing={"1rem"}>
                {adminTabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        sx={
                            location.pathname === tab.path && {
                                bgcolor: bgreen,
                                color: "white",
                                ":hover": { bgcolor: bgreen2 },
                            }
                        }
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}

                            <Typography>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))}

                {/* Logout Handler */}
                <Link onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToAppIcon />

                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>


    )
}


const isAdmin=false;
const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => setIsMobile(!isMobile);

    const handleClose = () => setIsMobile(false);

    if(!isAdmin) return <Navigate to="/admin"/>
    return (


        <Grid container minHeight={"100vh"}>

            <Box
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                    right: "1rem",
                    top: "1rem",
                }}
            >

                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>



            <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
                <Sidebar />
            </Grid>



            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{
                    bgcolor: grayColor,
                }}
            >
                {children}
            </Grid>

            <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w="50vw" />
            </Drawer>
        </Grid>
    )
}

export default AdminLayout
