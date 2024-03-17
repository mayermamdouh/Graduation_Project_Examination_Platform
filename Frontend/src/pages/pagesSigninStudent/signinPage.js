import { useState } from "react";
import "./signInStudent.css";

function SignInStudent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  return (
    <>
      <section className="MainSection">
        <div className="MainDiv">
          <div className="textSignStud">
            Kindly, sign in with your account <span> credentials </span>in order
            to have access to
            <br /> {}
            your examination for MATH301/FALL2023.
          </div>
          <div className="MainUserName">
            <div className="InputAndText">
              <div className="UserName">Username</div>
              <input
                type="text"
                className="InputUser"
                value={username}
                onChange={handleUsernameChange}
              ></input>
            </div>
          </div>
          <div className="MainUserName">
            <div className="InputAndText">
              <div className="UserName">Exam Password</div>
              <input
                type="password"
                className="InputUser"
                value={password}
                onChange={handlePasswordChange}
              ></input>
            </div>
          </div>
          <div className="BottonContinue">
            <button
              className={`Bottnclass ${
                username.trim() !== "" && password.trim() !== "" ? "Filled" : ""
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignInStudent;
