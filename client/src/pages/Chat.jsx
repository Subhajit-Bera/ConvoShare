import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import { IconButton, Skeleton, Stack } from "@mui/material";
import AppLayout from '../components/layout/AppLayout'
import { AttachFile as AttachFileIcon, Send as SendIcon, } from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import { grayColor,bgreen } from "../constants/color";

const Chat = () => {
    const containerRef = useRef(null);
    return (
        <>
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={grayColor}
                height={"90%"}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                {/* Show Messages */}

            </Stack>

            <form
                style={{
                    height: "10%",
                }}

            >
                <Stack
                    direction={"row"}
                    height={"100%"}
                    padding={"0.5rem"}
                    alignItems={"center"}
                    position={"relative"}
                >

                    {/* Attach File Icon */}
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: "1rem",
                            rotate: "30deg",
                        }}
            
                    >
                        <AttachFileIcon />
                    </IconButton>


                    {/* Input Box for message Input : Styled Icon */}
                    <InputBox
                        placeholder="Type Message Here..."
                    />

                    
                    {/* Message Send Button */}
                    <IconButton
                        type="submit"
                        sx={{
                            rotate: "-30deg",
                            bgcolor: bgreen,
                            color: "white",
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            "&:hover": {
                                bgcolor: "error.dark",
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>

                </Stack>

            </form>

        </>
    )

}




export default AppLayout()(Chat)
