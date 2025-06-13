import React from "react";
import Search from "./Search";
import Users from "./Users";
 

function Left() {
  return (
    <div className="w-[30%] bg-gray-600 text-gray-300">
      <h1 className="font-bold text-2xl p-2 px-11 mr-8">TalentConnectss</h1>
    {/* <div className="w-full   bg-black text-gray-300"> */}
      <Search />
      <div
        className=" flex-1  overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
   
    </div>
  
  );
}

export default Left;