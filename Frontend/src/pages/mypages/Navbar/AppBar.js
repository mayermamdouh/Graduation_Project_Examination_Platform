import React, { useState } from "react";
import "./AppBar.css";
import { Link } from "react-router-dom";
import PhotoUser from "../../../Assets/photoUser.png";

function Navbar() {
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
              <Link to="#Home" className="linkDrawer">
                <div className="divDrawer">Home</div>
              </Link>

              <hr className="hrDrawer" />
              <Link to="#About" className="linkDrawer">
                <div className="divDrawer">About</div>
              </Link>
              <hr className="hrDrawer" />

              <Link to="#Content Us" className="linkDrawer">
                <div className="divDrawer"> Content Us</div>
              </Link>
            </div>

            <hr className="hrDrawer" />
          </div>
        </div>
        <div className="logoAppBar">Examify</div>
        <nav className="navAppBar">
          <ul className="ulAppBar">
            <li className="liAppBar">
              <a href="#home" className="linksAppbar">
                Home
              </a>
            </li>
            <li className="liAppBar">
              <a href="#about" className="linksAppbar">
                Exams
              </a>
            </li>
            <li className="liAppBar">
              <a href="#contact" className="linksAppbar">
                Contact Us
              </a>
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
