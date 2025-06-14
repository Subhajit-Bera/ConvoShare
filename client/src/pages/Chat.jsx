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
import { grayColor, bgreen, bgc, bgreen2 } from "../constants/color";
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from '../lib/useInfiniteScrollTop';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
const Chat = ({ chatId, user }) => {
    const containerRef = useRef(null);
    const socket = getSocket();
    const dispatch = useDispatch();


    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

    //skip : !chatId : means if we don' thave chatId then skip this operation
    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const members = chatDetails?.data?.chat?.members;

    //Fetching old messges regarding pages
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page });


    //Use InfineScroll
    const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk.data?.messages
    );
    console.log(page);
    console.log(oldMessages);

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
    ];

    const submitHandler = (e) => {
        e.preventDefault();
        // console.log(message);
        if (!message.trim()) return;

        // Emitting the message to the server
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("");
    };

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget);
    };


    useEffect(() => {
        // socket.emit(CHAT_JOINED, { userId: user._id, members });
        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            setMessages([]);
            setMessage("");
            setOldMessages([]);
            setPage(1);
            // socket.emit(CHAT_LEAVED, { userId: user._id, members });
        };
    }, [chatId]);

    const newMessagesListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;

            setMessages((prev) => [...prev, data.message]);
        },
        [chatId]
    );

   

    //Create object of evenets 
    const eventHandler = {
        [NEW_MESSAGE]: newMessagesListener,
    };

    //Sending event to this custom hook for listing to these events
    useSocketEvents(socket, eventHandler);

    useErrors(errors);

    //Fetched old messages with infine scroll + realtime socket message
    const allMessages = [...oldMessages, ...messages];

    return chatDetails.isLoading ? (
        <Skeleton />
    ) : (
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
                {allMessages.map((i) => (
                    <MessageComponent key={i._id} message={i} user={user} />
                ))
                }

            </Stack>


            <form
                style={{
                    height: "10%",
                }}
                onSubmit={submitHandler}
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
                        onClick={handleFileOpen}
                    >
                        <AttachFileIcon />
                    </IconButton>


                    {/* Input Box for message Input : Styled Icon */}
                    <InputBox
                        placeholder="Type Message Here..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
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
            <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </>
    )

}




export default AppLayout()(Chat)
