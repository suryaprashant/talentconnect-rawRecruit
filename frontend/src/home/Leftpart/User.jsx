// import React from "react";
// import useConversation from "../../statemanage/useConversation.js";
// import { useSocketContext } from "../../context/SocketContext.jsx";

// function User({ user }) {
//   const { selectedConversation, setSelectedConversation } = useConversation();
//   const isSelected = selectedConversation?._id === user._id;
//   const { socket, onlineUsers } = useSocketContext();
//   const isOnline = onlineUsers.includes(user._id);
//   return (
//     <div
//       className={`hover:bg-slate-600 duration-300 ${
//         isSelected ? "bg-slate-700" : ""
//       }`}
//       onClick={() => setSelectedConversation(user)}
//     >
//       <div className="flex space-x-4 px-8 py-3 hover:bg-slate-700 duration-300 cursor-pointer">
//         <div className={`avatar ${isOnline ? "online" : ""}`}>
//           <div className="w-12 rounded-full">
//              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        
//           </div>
//         </div>
//         <div><h1 className="font-bold">{user.name}</h1>

//           <span>{user.email}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default User;

import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className="flex items-center space-x-4 px-8 py-3 hover:bg-slate-700 duration-300 cursor-pointer">
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="font-bold text-lg">{user.name}</h1>
          <span>{<user className="email"></user> }</span>
        </div>
      </div>
    </div>
  );
}

export default User;