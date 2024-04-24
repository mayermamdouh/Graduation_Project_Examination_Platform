import PhotoUser from "../../Assets/photoUser.png";

import logo from "../../Assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function NavBarStudent() {
     const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

     const handleToggleUserDropdown = () => {
       setUserDropdownOpen(!isUserDropdownOpen);
     };
  return (
    <>
      <header className="containerAppBar">
        {/* <div className="logoAppBar">Examify</div>
         */}
        <img alt="" src={logo} className="logoStudent"></img>

        <div className="mainUserStudent" onClick={handleToggleUserDropdown}>
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

export default NavBarStudent;