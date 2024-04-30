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
import { grayColor,bgreen,bgc, bgreen2 } from "../constants/color";
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';


const user={
    _id:"sdfsdfsdf",
    name:"Subha Bera"
}

const Chat = () => {
    const containerRef = useRef(null);
    return (
        <>
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={bgc}
                height={"90%"}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
            {sampleMessage.map((i)=>(
                    <MessageComponent key={i._id} message={i} user={user}/>
                ))
            }
                

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
                            bgcolor: bgreen2,
                            color: "white",
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            "&:hover": {
                                bgcolor: bgreen,
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
