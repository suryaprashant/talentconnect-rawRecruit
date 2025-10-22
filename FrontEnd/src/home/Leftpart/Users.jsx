
import { React, useEffect } from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import Loading from "../../components/Loading";
import useConversation from "../../statemanage/useConversation";

function Users() {
  const [allUsers, loading, unreadCounts, refreshUsers] = useGetAllUsers();
  const { selectedConversation } = useConversation();

  useEffect(() => {
    if (selectedConversation) {
      refreshUsers();
    }
  }, [selectedConversation]);

  const usersWithConversations = allUsers.filter(
    (user) => unreadCounts[user._id] !== undefined
  );

  const newUsers = allUsers.filter(
    (user) => unreadCounts[user._id] === undefined
  );

  return (
    <div>
      <h1 className="px-8 py-3 text-white font-semibold bg-blue-900 border-b border-blue-700">
        Messages
      </h1>
      <div
        className="py-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 100px - 64px)" }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            {usersWithConversations.length > 0 && (
              <div>
                <h3 className="px-4 py-2 text-sm font-semibold text-blue-300 bg-blue-800">
                  Recent Chats
                </h3>
                {usersWithConversations.map((user) => (
                  <User
                    key={user._id}
                    user={user}
                    unreadCount={unreadCounts[user._id] || 0}
                  />
                ))}
              </div>
            )}
            {newUsers.length > 0 && (
              <div>
                <h3 className="px-4 py-2 text-sm font-semibold text-blue-300 bg-blue-800 mt-2">
                  New Users
                </h3>
                {newUsers.map((user) => (
                  <User key={user._id} user={user} unreadCount={0} />
                ))}
              </div>
            )}
            {allUsers.length === 0 && !loading && (
              <p className="text-center text-blue-200 mt-4">No users found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
