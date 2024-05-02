import React,{ memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

//Also we can implement last message
const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,
}) => {
    // Maintaing Gap between Avtar and Chat name (single and group chat)
    let groupAvatar=false;
    if(avatar.length>1){
        groupAvatar=true;
    }else{
        groupAvatar=false;
    }
    
    return (

        <Link to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}>
           {}
            <div
                style={{
                    display: "flex",
                    gap: groupAvatar? "1.5rem":"unset",
                    alignItems: "center",
                    backgroundColor: sameSender ? "#FEF5ED" : "unset",
                    color: sameSender ? "black" : "unset",
                    position: "relative",
                    padding: "1rem",      
                }}
            >
                <AvatarCard avatar={avatar} />
                <Stack>
                    <Typography>{name}</Typography>
                    {newMessageAlert && (
                        <Typography>{newMessageAlert.count} New Message</Typography>
                    )}
                </Stack>

                {isOnline && (
                    <Box
                        sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "green",
                            position: "absolute",
                            top: "50%",
                            right: "1rem",
                            transform: "translateY(-50%)",
                        }}
                    />
                )}
            </div>

        </Link>


    )
}

export default memo(ChatItem);
