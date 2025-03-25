import React from "react";

const BoxComponent = ({ children }) => {
  return (
    <div className="bg-[#fff]  w-100 p-3 rounded-[10px] shadow-md">
      {children}
    </div>
  );
};

export default BoxComponent;
