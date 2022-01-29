import React from "react";
import Routes from "./Routes";
import Menu from "./Menu";
import './Layout.css'
/**
 * Defines the main layout of the application.
 * You will not need to make changes to this file.
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div>
      <div className="row">
        <div className="col-1 p-0 side-bar">
          <Menu />
        </div>
        <div className="col-10">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;