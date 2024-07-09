import { useEffect, useState } from "react";
import "./group.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/AppBar";
import groupIcon from "../../../Assets/groupIconBlack.png";
import axios from "axios";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";
// import editIcon from "../../../Assets/edit.svg";
function Groups() {
  const [valueSearchEngin, setvalueSearchEngin] = useState("");
  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [createGroup, setCreateGroup] = useState(false);
  const [GroupsDetails, setGroupsDetails] = useState([]);

  useEffect(() => {
    handleViewGroups();
  }, [createGroup]);

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleCreateNewGroupSection = () => {
    setCreateGroup(true);
  };

  const handleCreateGroup = async (e) => {
    // e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    formData.append("name", editExamNameValue);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/group/",
        formData,
        { headers: getAuthHeaders() }
      );
      // console.log(response);
      if (response.status === 200 || response.status === 201) {
        // console.log("Create Group successfully!", response.data);
        setCreateGroup(false);
        setEditExamNameValue("");
      } else {
        console.error("Failed to Create Group");
      }
    } catch (error) {
      console.error("Error Create Group:", error.message);
    }
  };
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
       navigate("/userType");
    } 
  }, []);

  const handleViewGroups = async (e) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/group/", {
        headers: getAuthHeaders(),
      });

      if (response.status === 200 || response.status === 201) {
        // console.log(response.data)
        setGroupsDetails(response.data);
        setShowLoader(false);
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="MainDivGroupPage">
        <div className={`MainPageGroup ${createGroup ? "" : "hidden"}`}>
          <div className="MainDivOfPage">
            <div className="MainDivAllExams padding">
              <div className="ContantSettings">
                <>
                  <div className="EditExamSectionGroup">
                    <div>Group Name: </div>
                    <input
                      value={editExamNameValue}
                      className="inputEditExam"
                      onChange={handleExamNameValue}
                    />

                    <button
                      className="ButtonSaveIntro marginLeft"
                      onClick={handleCreateGroup}
                    >
                      Create Group
                    </button>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>

        <div className={`MainPageGroup ${createGroup ? "hidden" : ""}`}>
          <div className="MainDivOfPage">
            <div className="MainDivAllExams padding">
              <div className="RowAllExamsOne">
                <input
                  className="SearchEnginAllExam"
                  placeholder="Search Exam Groups.."
                  value={valueSearchEngin}
                  onChange={(e) => setvalueSearchEngin(e.target.value)}
                ></input>
                <Link className="removeUnderline">
                  {" "}
                  <div
                    className="sectionButtonNewExam"
                    onClick={handleCreateNewGroupSection}
                  >
                    <div className="iconPlueNewExam">+</div>
                    <div>New Group</div>
                  </div>
                </Link>
              </div>
              <div>
                <div>
                  {showLoader ? (
                    <div className="loaderrr">
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <>
                      {GroupsDetails.map((group, index) => (
                        <div key={index}>
                          <div className="lineSeprete"></div>
                          <div className="RowAllExamsOne">
                            <div className="sectionExamNameHome">
                              <img
                                className="iconFile AddPadding"
                                alt=""
                                src={groupIcon} // Assuming groupIcon is imported somewhere
                              ></img>
                              <div className="ExamNameDiv">{group.name}</div>{" "}
                              {/* Render group name */}
                            </div>
                            <Link
                              to={`/groups/setting?group_id=${group.id}`}
                              className="AssignButton"
                            >
                              {" "}
                              {/* Assuming group id is available */}
                              Setting Group
                            </Link>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Groups;
