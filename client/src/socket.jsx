//We can creater socket in app,but in that case we have to pass that to eveyone.
//So we will create a contex so it can be accessible everywhere in the app

import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(server, { withCredentials: true }), []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };
