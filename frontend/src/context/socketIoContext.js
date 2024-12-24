import { useState, useContext, createContext, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext();
const SocketProvider = ({children})=>{
    const [socket, setSocket] = useState(null);
    const [auth] = useAuth();

    useLayoutEffect(()=>{
       
        const newSocket = io("http://localhost:5000", {
          id:auth.id,
          allContacts: [],
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("Connected to the server:", newSocket.id);
        });


        newSocket.on("disconnect", () => {
          console.log("Disconnected from the server");
        });


        return () => {
          newSocket.disconnect();
          setSocket(null);
          console.log("Socket disconnected");
        };

    }, []);

    return (
        <SocketContext.Provider value={[socket, setSocket]}>
            {children}
        </SocketContext.Provider>
    )
};


const useSocket = () => useContext(SocketContext);

export {useSocket, SocketProvider};
