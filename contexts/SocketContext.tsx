// // import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// // import { io, Socket } from 'https://esm.sh/socket.io-client@4.7.5';
// // import { useAuth } from './AuthContext';

// // const SocketContext = createContext<Socket | null>(null);

// // export const useSocket = (): Socket | null => {
// //   return useContext(SocketContext);
// // };

// // export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
// //   const [socket, setSocket] = useState<Socket | null>(null);
// //   const { currentUser } = useAuth();

// //   useEffect(() => {
// //     if (currentUser) {
// //       // Establish connection
// //       const newSocket = io('http://localhost:5001');
// //       setSocket(newSocket);
      
// //       // Register user with the socket server
// //       newSocket.emit('addUser', currentUser.id);

// //       // Cleanup on component unmount or user logout
// //       return () => {
// //         newSocket.disconnect();
// //       };
// //     } else {
// //       // If there's no user, disconnect any existing socket
// //       if (socket) {
// //         socket.disconnect();
// //         setSocket(null);
// //       }
// //     }
// //   }, [currentUser]);

// //   return (
// //     <SocketContext.Provider value={socket}>
// //       {children}
// //     </SocketContext.Provider>
// //   );
// // };



// // src/contexts/SocketContext.tsx
// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useAuth } from './AuthContext';

// type SocketContextType = {
//   socket: Socket | null;
// };

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context;
// };

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketProvider = ({ children }: SocketProviderProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     if (currentUser) {
//       const newSocket = io('http://localhost:5000', {
//         query: { userId: currentUser._id },
//       });
//       setSocket(newSocket);

//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [currentUser]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Connect to the backend socket server
      const newSocket = io('http://localhost:5001');
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
