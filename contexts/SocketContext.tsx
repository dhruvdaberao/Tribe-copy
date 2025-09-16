// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { io, Socket } from 'https://esm.sh/socket.io-client@4.7.5';
// import { useAuth } from './AuthContext';

// const SocketContext = createContext<Socket | null>(null);

// export const useSocket = (): Socket | null => {
//   return useContext(SocketContext);
// };

// export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     if (currentUser) {
//       // Establish connection
//       const newSocket = io('http://localhost:5001');
//       setSocket(newSocket);
      
//       // Register user with the socket server
//       newSocket.emit('addUser', currentUser.id);

//       // Cleanup on component unmount or user logout
//       return () => {
//         newSocket.disconnect();
//       };
//     } else {
//       // If there's no user, disconnect any existing socket
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//     }
//   }, [currentUser]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };






// frontend/src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Connect to backend socket server
      const newSocket = io("http://localhost:5001", {
        query: { userId: currentUser.id }, // optional: pass userId
      });
      setSocket(newSocket);

      // Register user
      newSocket.emit("addUser", currentUser.id);

      // Cleanup
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If no user, disconnect any existing socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
