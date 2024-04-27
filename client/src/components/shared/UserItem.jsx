import React, { memo } from 'react'
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";

const UserItem = ({
    user,
    handler,
    handlerIsLoading
}) => {
    const { name, _id, avatar } = user;
    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"0.1rem"}
                width={"100%"}
                sx={{
                    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", 
                    borderRadius: "20px",
                }}
            >
                <Avatar />

                <Typography
                    variant="body1"
                    sx={{
                        flexGlow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",

                    }}
                >
                    {name}
                </Typography>

                <IconButton
                    size="small"
                    sx={{
                        
                        bgcolor: "#91C788",
                        color: "white",
                        "&:hover": {
                            bgcolor: "#99BC85",
                        },
                    }}
                    onClick={() => handler(_id)}
                    disabled={handlerIsLoading}
                >
                    <AddIcon />
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem);