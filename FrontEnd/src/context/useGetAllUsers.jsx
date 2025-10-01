// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import axios from "../lib/axiosInstance";


// function useGetAllUsers() {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     const getUsers = async () => {
//       setLoading(true);
//       try {
//         const token = Cookies.get("jwt");
       
//         const response = await axios.get(`/api/auth/allusers`, {
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
      
//         setAllUsers(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.log("Error in useGetAllUsers: " + error);
//       }
//     };
//     getUsers();
//   }, []);
//   return [allUsers, loading];
// }

// export default useGetAllUsers;


import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "../lib/axiosInstance";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt");
        
        const [usersResponse, unreadResponse] = await Promise.all([
          axios.get(`/api/messages/allusers`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`/api/messages/unread-count`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);
        
        // Convert unread counts to a map for easy access
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
    getUsers();
  }, []);
  
  return [allUsers, loading, unreadCounts];
}

export default useGetAllUsers;