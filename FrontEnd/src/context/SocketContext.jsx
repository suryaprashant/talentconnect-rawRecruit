import { createContext, useContext, useEffect, useState } from "react";
import { useLegacyAuth } from "./AuthProvider";
import io from "socket.io-client";
const socketContext = createContext();


export const useSocketContext = () => {
  return useContext(socketContext);
};

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [authUser] = useAuth();

//   useEffect(() => {
//     if (authUser) {
//       // const socket = io(`${import.meta.env.VITE_Backend_URL}`, {
//       //   query: {
//       //     userId: authUser.user._id,
//       //   },
//       // });

//       const socket = io(import.meta.env.VITE_Backend_URL, {
//         query: {
//           userId: authUser.user._id,
//         },
//         transports: ['websocket'] // Add this for production
//       });


//       setSocket(socket);
//       socket.on("getOnlineUsers", (users) => {
//         setOnlineUsers(users);
//       });
//       return () => socket.close();
//     } else {
//       if (socket) {
//         socket.close();
//         setSocket(null);
//       }
//     }
//   }, [authUser]);
//   return (
//     <socketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </socketContext.Provider>
//   );
// };


// Enhanced SocketProvider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useLegacyAuth();

  useEffect(() => {
    if (authUser && authUser.user?._id) {
      try {
        const socketInstance = io(import.meta.env.VITE_Backend_URL, {
          query: {
            userId: authUser.user._id,
          },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          console.log("Socket connected successfully");
          setSocket(socketInstance);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        socketInstance.on("getOnlineUsers", (users) => {
          setOnlineUsers(users);
        });

    
        return () => {
          socketInstance.close();
        };
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};