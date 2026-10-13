
import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import sound from "../assets/notification.mp3";

const useGetSocketNotification = (
  notifications,
  setNotifications,
  setUnreadCount
) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available for notifications");
      return;
    }

    const handleNewNotification = (notification) => {
      console.log("🔔 New notification received:", notification);

      // play sound
      const audio = new Audio(sound);
      audio.play();

      // push notification to top
      setNotifications((prev) => [notification, ...prev]);

      // increase unread count
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, setNotifications, setUnreadCount]);
};

export default useGetSocketNotification;