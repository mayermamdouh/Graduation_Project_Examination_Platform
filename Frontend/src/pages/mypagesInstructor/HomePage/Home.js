import "./HomeCss.css";
import Navbar from "../Navbar/AppBar";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { updateToken } from "../../mypagesInstructor/component/file";
function HomePage() {
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (authTokens) {
      navigate("/Exams");
    } else {
      navigate("/userType");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="BodyHome"></div>
    </>
  );
}

export default HomePage;
