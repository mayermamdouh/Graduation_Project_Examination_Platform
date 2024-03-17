import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./SignInAndSignUp.css";
import EmailIcon from "../../Assets/email.png";
import PasswordIcon from "../../Assets/password.png";
import CloseEyesIcon from "../../Assets/closeeyes.png";
import OpenEyesIcon from "../../Assets/openeyes.png";
import microsoft from "../../Assets/microsoft.svg";
import IconGoogle from "../../Assets/google.svg";

function Login() {
  const [actionPass, setActionPass] = useState(CloseEyesIcon);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleEyes = () => {
    setActionPass((prevIcon) =>
      prevIcon === CloseEyesIcon ? OpenEyesIcon : CloseEyesIcon
    );
  };

  return (
    <div className="BodyLogin">
      <div className="containerLogin">
        <div className="Header">
          <div className="text">SIGN IN</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
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
          <div className="submit">Sign in</div>
        </div>
        <div className="forget-password">
          Forgot Your Password? <span>&nbsp; Click Here!</span>
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
            <div className="TextIcon">sign in with Microsoft</div>
          </div>
          <div className="Loginmicrosoft">
            <img
              src={IconGoogle}
              alt=""
              className="Iconmicrosoft"
              loading="lazy"
            />
            <div className="OptionsToLoginLine"></div>
            <div className="TextIcon">sign in with Google</div>
          </div>
          <div className="BreakLine"></div>
          <div className="lastSection">
            <div className="TextHaveAccount">Don&#39;t have an account? </div>
            <Link to="/Home/Login/3" className="CreateAccount">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
