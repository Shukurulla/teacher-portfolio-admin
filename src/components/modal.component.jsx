import React from "react";

const ModalComponent = ({ children, state, setState }) => {
  return (
    <div
      className={`absolute w-100 h-100 top-0 l-0 z-100 bg-[#00000058] ${
        state ? "" : "hidden"
      }`}
    >
      {children}
    </div>
  );
};

export default ModalComponent;
