import React, { useState } from "react";
import "./AppBar.css";
import { Link, useLocation } from "react-router-dom";
import PhotoUser from "../../../Assets/photoUser.png";
import logo from "../../../Assets/logo.png";

function Navbar() {
  const location = useLocation();
  const isStepActive = (stepPath) => {
    return location.pathname.startsWith(stepPath);
  };
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const handleToggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleToggleUserDropdown = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
  };
  return (
    <>
      <header className="containerAppBar">
        <button className="menu_toggle" onClick={handleToggleDrawer}>
          <span className="menuLine"></span>
          <span className="menuLine"></span>
          <span className="menuLine"></span>
        </button>

        <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
          <div className="bodyDrawer">
            <div className="linksDrawer">
              <Link to="#Home" className="linkDrawer paddingDrawer">
                <div className="divDrawer">Home</div>
              </Link>

              <hr className="hrDrawer" />
              <Link to="#About" className="linkDrawer paddingDrawer">
                <div className="divDrawer">Exams</div>
              </Link>
              <hr className="hrDrawer" />

              <Link to="#Content Us" className="linkDrawer paddingDrawer">
                <div className="divDrawer"> Groups</div>
              </Link>
            </div>

            <hr className="hrDrawer" />
          </div>
        </div>
        {/* <div className="logoAppBar">Examify</div>
         */}
        <img className="logo" alt="" src={logo}></img>
        <nav className="navAppBar">
          <ul className="ulAppBar">
            <li className="liAppBar">
              <Link
                to="/Home"
                className={`linksAppbar ${
                  isStepActive("/Home") ? "activeAppBar" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li className="liAppBar">
              <Link
                to="/Exams"
                className={`linksAppbar ${
                  isStepActive("/Exams") ? "activeAppBar" : ""
                }`}
              >
                Exams
              </Link>
            </li>
            <li className="liAppBar">
              <Link
                to="/groups"
                className={`linksAppbar ${
                  isStepActive("/groups") ? "activeAppBar" : ""
                }`}
              >
                Groups
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mainUser" onClick={handleToggleUserDropdown}>
          <img src={PhotoUser} className="photoUser" alt="" loading="lazy" />

          <div className={`userDropdown ${isUserDropdownOpen ? " open" : ""}`}>
            <div className="NameAndPostion">
              <div className="NameUserr">Dr Ahmed</div>
              <div className="postionUser">instructor</div>
            </div>
            <div className="lineNavBar"></div>
            <Link className="LinksuserDropdown" to="/profile">
              Profile
            </Link>
            <div className="lineNavBar"></div>
            <Link className="LinksuserDropdown" to="/settings">
              Settings
            </Link>
            <div className="lineNavBar"></div>
            <Link className="LinksuserDropdown" to="/logout">
              Logout
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
