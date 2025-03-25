import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { activePage } = useSelector((state) => state.ui);
  const navItems = [
    {
      label: "Bosh sahifa",
      path: "/",
      icon: "bi-house",
    },
    {
      label: "O'qituvchilar",
      path: "/teachers",
      icon: "bi-people",
    },
  ];
  return (
    <div className="mt-2">
      <ul>
        {navItems.map((item) => (
          <Link
            to={item.path}
            className={`px-4 w-[80%] rounded-[10px] mb-3 mx-auto p-2 font-semibold flex gap-2 text-[18px] hover:bg-[#96999b48] ${
              activePage == item.label ? "bg-[#6365f11e]" : ""
            }`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
