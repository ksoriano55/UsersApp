import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import  NavBar  from "./Navbar";
export default function App() {
  
  return (
    <Fragment>
          <div className="horizontalMenucontainer">
            <div className="page">
              <div className="open">
                <NavBar />
              </div>
              <div className="main-content app-content">
                <div className="side-app">
                  <div
                    className="main-container container-fluid"
                  >
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
    </Fragment>
  );
}
