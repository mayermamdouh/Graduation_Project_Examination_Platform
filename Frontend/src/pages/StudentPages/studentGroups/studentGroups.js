// import { useLocation } from "react-router";
import "../studentGroups.css";
import { Link, useNavigate } from "react-router-dom";
import groupIcon from "../../../Assets/groupIcon.png";
import NavBarStudent from "../NavbarStudent";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";

function StudentPage() {
  const [valueInputCode, setValueInputCode] = useState("");
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    handleViewGroups();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [message]);
  const [loderValue, setLoderValue] = useState(false);
  
  const handleViewGroups = async (e) => {
    setLoderValue(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/student/group/`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 200 || response.status === 201) {
        setGroups(response.data);
        setLoderValue(false);
        // console.log(response.data);

      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
      navigate("/userType");
    }
  }, []);
  const handleAddToNewGroup = async (e) => {
    const formData = new FormData();
    formData.append("group_code", valueInputCode);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/student/group/join/",
        formData,
          { headers: getAuthHeaders() }
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Joined successfully!");
        handleViewGroups();
      } else {
        console.error("Failed to Added this group");
      }
    } catch (error) {
      console.error("Error assign student:", error.message);
    }
  };

  // localStorage.clear();
  

  return (
    <>
      {/*           NavBar Student */}
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          {message ? <div className="messages">{message}</div> : ""}
          <div className="MyGroupsWord">Join To Group Enter The code</div>

          <div className="BlockInputCode">
            <input
              className="InputFeild"
              onChange={(e) => setValueInputCode(e.target.value)}
            ></input>
            <button className="ButtonJoin" onClick={handleAddToNewGroup}>
              Join{" "}
            </button>
          </div>
          <div className="MyGroupsWord">My Groups</div>
          {loderValue ? (
            <div className="loaderrr">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {groups.length > 0 ? (
                groups.map((group, index) => (
                  <div className="secondMianPageStudent " key={index}>
                    <img src={groupIcon} className="groupIcon" alt=""></img>
                    <div className="NameOfGroup colorAdd">
                      {" "}
                      {group.group_name}
                    </div>
                    <Link
                      to={`/student/SpecificGroup?group_id=${group.group_id}`}
                      className="LinkSpecificGroup"
                    >
                      <div className="ButtonOprnGroup">open</div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="NoGroup">no group added yet </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentPage;
