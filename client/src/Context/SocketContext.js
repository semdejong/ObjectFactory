import React, { useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext();

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const socket = io("http://localhost:3002");

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
