import "./SignInAndSignUp.css";
import EmailIcon from "../../Assets/email.png";
import PasswordIcon from "../../Assets/password.png";
import PersonIcon from "../../Assets/person.png";
import CloseEyesIcon from "../../Assets/closeeyes.png";
import OpenEyesIcon from "../../Assets/openeyes.png";
import microsoft from "../../Assets/microsoft.svg";
import IconGoogle from "../../Assets/google.svg";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [actionPass, setActionPass] = useState(CloseEyesIcon);
  const [userName, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleEyes = () => {
    setActionPass((prevIcon) =>
      prevIcon === CloseEyesIcon ? OpenEyesIcon : CloseEyesIcon
    );
  };

  const handleCreateLocalToStoreUserInformation = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userInformation")) || [];
    const Response = {
      userName: userName,
      email: email,
      password: password,
    };

    const updatedResponses = [...storedResponses, Response];
    localStorage.setItem("userInformation", JSON.stringify(updatedResponses));
  };

  return (
    <div className="BodyLogin">
      <div className="containerLogin">
        <div className="Header">
          <div className="text">Sign up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="inputLogin">
            <img src={PersonIcon} alt="" loading="lazy" />
            <input
              type="text"
              className="placeholder"
              placeholder="Write Your User Name.."
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
       
          <div className="inputLogin">
            <img src={EmailIcon} alt="" loading="lazy" />
            <input
              type="email"
              placeholder="Write Your Email.."
              className="placeholder"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="inputLogin">
            <img src={PasswordIcon} alt="" loading="lazy" />
            <input
              type={actionPass === OpenEyesIcon ? "text" : "password"}
              placeholder="Write Your Password.."
              className="placeholder"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <img
              src={actionPass}
              loading="lazy"
              alt=""
              className="eyes"
              onClick={toggleEyes}
            />
          </div>
        </div>

        <div className="submit-container">
          {/* <div className="submit" onClick={handleActionClick}>
            Sign UP
          </div> */}
          <Link to="/Home" className="removeUnderline">
            <div
              className="submit"
              onClick={handleCreateLocalToStoreUserInformation}
            >
              Sign up
            </div>
          </Link>
          <div className="haveAccount">
            Already have an account?{" "}
            <Link className="LinkLogin" to="/Home/Login/2">
              Login
            </Link>
          </div>
        </div>

        <div className="BreakLine"></div>
        <div className="OptionsToLogin">
          <div className="Loginmicrosoft">
            <img
              src={microsoft}
              alt=""
              className="Iconmicrosoft"
              loading="lazy"
            />
            <div className="OptionsToLoginLine"></div>
            <div className="TextIcon">sign up with Microsoft</div>
          </div>
          <div className="Loginmicrosoft">
            <img
              src={IconGoogle}
              alt=""
              className="Iconmicrosoft"
              loading="lazy"
            />
            <div className="OptionsToLoginLine"></div>
            <div className="TextIcon">sign up with Google</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
