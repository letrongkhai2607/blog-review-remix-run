import { Outlet } from "@remix-run/react";
import React from "react";

function Index() {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Index;
