import PhotoUser from "../../Assets/photoUser.png";

import logo from "../../Assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function NavBarStudent() {
     const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

     const handleToggleUserDropdown = () => {
       setUserDropdownOpen(!isUserDropdownOpen);
     };


  const handleSignOut = async (e) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/auth/signout/`,
        {}
        // { headers: getAuthHeaders() }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Sign out successful:", response.data);
        localStorage.clear();

        window.location.href = "/userType";
        window.history.pushState(null, "", window.location.href);
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
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
            <div className="LinksuserDropdown" onClick={handleSignOut}>
              Logout
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBarStudent;