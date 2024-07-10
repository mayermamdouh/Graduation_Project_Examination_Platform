import "./SignInAndSignUp.css";
import EmailIcon from "../../Assets/email.png";
import PasswordIcon from "../../Assets/password.png";
import PersonIcon from "../../Assets/personIconSign.png";
import CloseEyesIcon from "../../Assets/closeeyes.png";
import OpenEyesIcon from "../../Assets/openeyes.png";
import microsoft from "../../Assets/microsoft.svg";
import IconGoogle from "../../Assets/google.svg";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [actionPass, setActionPass] = useState(CloseEyesIcon);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword] = useState("");
  const [password2, setConfirmPassword] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [typeOfUserStudent, setTypeOfUserStudent] = useState(false);
  const [typeOfUserTeacher, setTypeOfUserTeacher] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  // console.log(username, email, password1, password2, first_name, last_name);
  const toggleEyes = () => {
    setActionPass((prevIcon) =>
      prevIcon === CloseEyesIcon ? OpenEyesIcon : CloseEyesIcon
    );
  };

  const location = useLocation();

  // Parse the query parameters from the location
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("type");
  //  console.log("userType : ", userType);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (typeOfUserTeacher && statusSuccess) {
  //     navigate("/Exams");
  //   } else if (typeOfUserStudent && statusSuccess) {
  //     navigate("/student");
  //   }
  // }, [statusSuccess, typeOfUserTeacher, typeOfUserStudent]);

  const handleSignUp = async (e) => {
    // e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password1", password1);
    formData.append("password2", password2);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("type", userType);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/signup/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("User signed up successfully!");
        setStatusSuccess(true);
        // const studentData = response.data.data.is_student;
        // const TeacherData = response.data.data.is_instructor;
        // console.log("studentData: ", studentData);
        // console.log("TeacherData: ", TeacherData);

         navigate(`/userType/SignIn?type=${userType}&signup=true`);
        // console.log("response: ", response);
        // if (studentData) {
        //   setTypeOfUserStudent(studentData);
        // } else if (TeacherData) {
        //   setTypeOfUserTeacher(TeacherData);
        // }

        const tokens = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        };
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      } else {
        throw new Error("Unexpected status code: " + response.status);
      }
    } catch (error) {
      // Log the error
      console.error("Error signing up:", error.message);
    }
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
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="inputLogin">
            <img src={PersonIcon} alt="" loading="lazy" />
            <input
              type="text"
              className="placeholder"
              placeholder="Write Your First Name.."
              value={first_name}
              onChange={(e) => {
                setfirst_name(e.target.value);
              }}
            />
          </div>
          <div className="inputLogin">
            <img src={PersonIcon} alt="" loading="lazy" />
            <input
              type="text"
              className="placeholder"
              placeholder="Write Your Last Name.."
              value={last_name}
              onChange={(e) => {
                setlast_name(e.target.value);
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
              value={password1}
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
          <div className="inputLogin">
            <img src={PasswordIcon} alt="" loading="lazy" />
            <input
              type={actionPass === OpenEyesIcon ? "text" : "password"}
              placeholder="Confirm Password.."
              className="placeholder"
              value={password2}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            {/* <img
              src={actionPass}
              loading="lazy"
              alt=""
              className="eyes"
              onClick={toggleEyes}
            /> */}
          </div>
        </div>

        <div className="submit-container">
          {/* <div className="submit" onClick={handleActionClick}>
            Sign UP
          </div> */}
          {/* <Link to="/Home" className="removeUnderline"> */}
          <div className="submit" onClick={handleSignUp}>
            Sign up
          </div>
          {/* </Link> */}
          <div className="haveAccount">
            Already have an account?{" "}
            <Link
              className="LinkLogin"
              to={`/userType/SignIn?type=${userType}`}
            >
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
