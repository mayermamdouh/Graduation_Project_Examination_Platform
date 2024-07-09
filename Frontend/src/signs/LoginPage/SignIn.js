import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./SignInAndSignUp.css";
import EmailIcon from "../../Assets/email.png";
import PasswordIcon from "../../Assets/password.png";
import CloseEyesIcon from "../../Assets/closeeyes.png";
import OpenEyesIcon from "../../Assets/openeyes.png";
import microsoft from "../../Assets/microsoft.svg";
import IconGoogle from "../../Assets/google.svg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
function Login() {
  const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userType = searchParams.get("type");
     const signUp = searchParams.get("signup");
    // console.log("userType: ", userType);
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

  const [actionPass, setActionPass] = useState(CloseEyesIcon);
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [userData, setUserData] = useState();

   

    // Parse the query parameters from the location
  

  const toggleEyes = () => {
    setActionPass((prevIcon) =>
      prevIcon === CloseEyesIcon ? OpenEyesIcon : CloseEyesIcon
    );
  };

  const navigate = useNavigate();

  // Use useEffect to navigate based on the presence of auth tokens
  useEffect(() => {
    if (statusSuccess && authTokens ) {
      if (userData.type === "instructor") {
        navigate("/Exams");
      } else if (userData.type === "student") {
        navigate("/student");
      }
      
    }
  }, [authTokens, navigate]);

  // Parse the query parameters from the location


  const handleSignIn = async (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("username", user_name);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/signin/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log("User signed in successfully!", response.data);
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setUserData(jwtDecode(response.data.access));
        setStatusSuccess(true);
      } else {
        console.error("Failed to sign in");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div className="BodyLogin">
      {signUp && (
        <div className="pooostionDiv">
          <p className="messages postionmessage">
            Sign up is successful. Please log in with your credentials.
          </p>
        </div>
      )}
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
              placeholder="Write Your Username.."
              className="placeholder"
              value={user_name}
              onChange={(e) => {
                setUser_name(e.target.value);
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
          {/* <Link className="notunsderline" to={}> */}{" "}
          <div className="submit" onClick={handleSignIn}>
            Sign in
          </div>
          {/* </Link> */}
          {/* success */}
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
            <Link
              to={`/userType/SignUp?type=${userType}`}
              className="CreateAccount"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
