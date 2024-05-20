import React from 'react'
import { Grid, Skeleton, Drawer } from "@mui/material";
import ChatList from '../specific/ChatList';
import { useParams } from "react-router-dom";
import { sampleChats } from '../../constants/sampleData';

import Header from './Header'
import Title from "../shared/Title";
import Profile from '../specific/Profile';

import { useDispatch,useSelector } from 'react-redux';
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobile } from '../../redux/reducers/misc';
import { useErrors } from '../../hooks/hook';
import { getSocket } from '../../socket';

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const chatId = params.chatId;

        const dispatch = useDispatch();
        const socket=getSocket();

        //Handling mobile viewport
        const { isMobile } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

        console.log(socket.id);

        useErrors([{ isError, error }]);

        const handleMobileClose = () => dispatch(setIsMobile(false));
        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log("DeleteChat", _id, groupChat)
        }
        return (
            <>
                <Title />
                <Header />

                {isLoading ? (
                    <Skeleton />
                ) : (
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList
                            w="70vw"
                            chats={data?.chats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            // newMessagesAlert={newMessagesAlert}
                            // onlineUsers={onlineUsers}
                        />
                    </Drawer>
                )}


                {/* 4rem is the height of header */}
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                        }}
                        height={"100%"}
                    >
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            <ChatList
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                            // newMessagesAlert={newMessagesAlert}
                            // onlineUsers={onlineUsers}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
                        <WrappedComponent {...props} chatId={chatId} user={user} />
                    </Grid>


                    <Grid
                        item
                        md={4}
                        lg={3}
                        height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.85)",
                        }}
                    >
                        <Profile  user={user}/>
                    </Grid>
                </Grid>

            </>
        );
    }
}

export default AppLayout
