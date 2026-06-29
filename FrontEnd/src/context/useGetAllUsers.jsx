import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
import axios from "../lib/axiosInstance";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  const refreshUsers = async () => {
    setLoading(true);
    try {
      
      
      const [usersResponse, unreadResponse] = await Promise.all([
        axios.get("/api/messages/allusers"),
        axios.get("/api/messages/unread-count"),
      ]);
      
      const unreadMap = {};
      unreadResponse.data.forEach(item => {
        unreadMap[item._id] = item.count;
      });
      
      setAllUsers(usersResponse.data);
      setUnreadCounts(unreadMap);
      setLoading(false);
    } catch (error) {
      console.log("Error in useGetAllUsers: " + error);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);
  
  return [allUsers, loading, unreadCounts, refreshUsers];
}

export default useGetAllUsers;