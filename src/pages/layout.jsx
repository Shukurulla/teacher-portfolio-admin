import React from "react";
import Navbar from "../components/header";
import Sidebar from "../components/sidebar";

const Layout = ({ activePage }) => {
  return (
    <div>
      <Navbar />
      <div className="row gap-0">
        <div className="col-lg-2 shadow-md m-0 p-0 col-md-4 col-sm-12">
          <Sidebar />
        </div>
        <div className="col-lg-10 p-0 col-md-8 col-sm-12">
          <div className=" relative bg-[#aeb5ba48] overflow-y-scroll h-[90vh]">
            {activePage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
