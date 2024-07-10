import { useEffect, useState } from "react";
import groupIcon from "../../../Assets/groupIconBlack.png";
import personIcon from "../../../Assets/person.png";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar/AppBar";
import file_icon from "../../../Assets/file-icon.svg";
import "./group.css";
import axios from "axios";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";

function GroupSetting() {
  const [isEditExamName, setIsEditExamName] = useState(true);
  const [editExamNameValue, setEditExamNameValue] = useState("");

  const [openAddMember, setOpenAddMember] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [displayAllUserTakenIt, setDisplayAllUserTakenIt] = useState(true);
  const [displayAllExamsAssignIt, setDisplayAllExamsAssignIt] = useState(false);
  const [valueInputEmail, setValueInputEmail] = useState("");
  const [message, setMessage] = useState("");
  const [GroupsDetails2, setGroupsDetails2] = useState([]);
  const [StudetnInsideGroupDetails, setStudetnInsideGroupDetails] = useState(
    []
  );

  const [ExamsInsideGroupDetails, setExamsInsideGroupDetails] = useState([]);

  // const [makeReloadToPage ,setMakeReloadToPage] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const group_id = searchParams.get("group_id");

  useEffect(() => {
    handleViewGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAllQuestion = () => {
    setDisplayAllUserTakenIt(true);
    setDisplayAllExamsAssignIt(false);
  };
  const handleAnswers = () => {
    setDisplayAllUserTakenIt(false);
    setDisplayAllExamsAssignIt(true);
  };

  const handleExamName = () => {
    setIsEditExamName(!isEditExamName);
  };

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleAddButtonClickExamName = () => {
    setIsEditExamName(true);
    handleUpdateGroup();
  };

  const handleAddMemberOpen = () => {
    setOpenAddMember(!openAddMember);
  };

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEmailChange = (e) => {
    setValueInputEmail(e.target.value);
  };
  const [showLoder, setShowLoder] = useState(false);

  const handleViewGroup = async (e) => {
    setShowLoder(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/group/${group_id}/`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("response.data: ", response.data);
        setGroupsDetails2(response.data[0]["Group data"]);
        setStudetnInsideGroupDetails(response.data[1]["Students"]);
        setExamsInsideGroupDetails(response.data[3]["Exams"]);
        setShowLoder(false);
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };

  const handleDeleteGroupApi = async (e) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/group/${group_id}/`,

        { headers: getAuthHeaders() }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        // console.log("Group get successfully!");
        setShowDeleteModal(false);
        window.location.href = "/groups";
      } else {
        console.error("Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error.message);
    }
  };

  const handleAssignNewStudent = async (e) => {
    const formData = new FormData();
    formData.append("student_email", valueInputEmail);
    formData.append("group_code", GroupsDetails2.code);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/group/assign-student/",
        formData,
        { headers: getAuthHeaders() }
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Student Assigned successfully!");
        setValueInputEmail("");
        setOpenAddMember(false);
        handleViewGroup();
      } else {
        console.log("Failed to assign student");
      }
    } catch (error) {
      console.error("Error assign student:", error.message);
    }
  };

  const handleDeleteMember = async (studentemail) => {
    const formData = new FormData();
    formData.append("group_code", GroupsDetails2.code);
    formData.append("student_email", studentemail);


     const authTokens = localStorage.getItem("authTokens")
       ? JSON.parse(localStorage.getItem("authTokens"))
       : null;
     const accessToken = authTokens ? authTokens.access : null;
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/group/unassign-student/`,
        {
          data: formData,

          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        setMessage("student Removed successfully!");
        handleViewGroup();
      } else {
        console.error("Failed to remove student");
      }
    } catch (error) {
      console.error("Error removeing student:", error.message);
    }
  };

  const handleUpdateGroup = async (e) => {
    const formData = new FormData();
    formData.append("name", editExamNameValue);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/group/${group_id}/`,
        formData,
        { headers: getAuthHeaders() }
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Group update successfully!");
        handleViewGroup();
      } else {
        console.log("Failed to update group");
      }
    } catch (error) {
      console.error("Error aupdate group:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="MainDivGroupPage">
        {showLoder ? (
          <div className="loaderrr">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {GroupsDetails2 && GroupsDetails2.name && GroupsDetails2.code && (
              <div className="MainDivDisplay">
                {message ? <div className="messages">{message}</div> : ""}
                <div className="TextContnat">Group Settings </div>
                <div className="MainDivContantSettings">
                  <div className="addPadding">
                    <div className="ContantSettings">
                      {isEditExamName ? (
                        <>
                          <div
                            className="sectionExamName"
                            onClick={handleExamName}
                          >
                            <img
                              src={groupIcon}
                              className="iconFile AddPadding"
                              alt=""
                            />
                            <div className="ExamInstructTextAdd">
                              {GroupsDetails2.name || ""}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="EditExamSectionGroup">
                            <div>Group Name: </div>
                            <input
                              value={editExamNameValue || ""}
                              className="inputEditExam"
                              onChange={handleExamNameValue}
                            />
                            <div className="updateAndCancelButton">
                              <button
                                className="ButtonSaveIntro"
                                //   onClick={handleAddButtonClickExamName}
                              >
                                cancel
                              </button>
                              <button
                                className="ButtonSaveIntro"
                                onClick={handleAddButtonClickExamName}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="groupCode">
                      Group Code:
                      <div className="codeGroup">
                        {" "}
                        {GroupsDetails2.code || ""}
                      </div>
                    </div>
                    <div className="groupProperts">
                      <div className="properts" onClick={handleAddMemberOpen}>
                        {" "}
                        + Add Members
                      </div>

                      <div
                        className="sectionButtonNewExam marginLeft"
                        onClick={handleDeleteGroup}
                      >
                        Delete Group
                      </div>

                      <Link className="removeUnderline ">
                        {" "}
                        <div
                          className="sectionButtonNewExam"
                          // onClick={handleCreateNewGroupSection}
                        >
                          Assign Exam
                        </div>
                      </Link>
                    </div>
                    <div
                      className={`AddMemberSection ${
                        openAddMember ? "openAddMember" : "hiddenAddMember"
                      }`}
                    >
                      <div className="blockAddMember">
                        <div className="howToAddStudent">
                          <div>
                            To add a new member, simply tell them to create an
                            account for them on this app and enter their email
                            in the box below.
                          </div>
                          <div className="secionAddUser">
                            <input
                              placeholder="Example: StudentEmail@gmail.com"
                              type="text"
                              value={valueInputEmail}
                              className="inputEmailUser"
                              onChange={handleEmailChange}
                            ></input>{" "}
                            <div
                              className="sectionButtonNewExam"
                              onClick={handleAssignNewStudent}
                            >
                              Add
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="blockAddMember">
                        <div className="howToAddStudent">
                          <div>
                            To add a new member, simply give it the group ID
                          </div>
                          <div className="groupCode">
                            Group Code:
                            <div className="codeGroup">
                              {" "}
                              {GroupsDetails2.code || ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="MyGroupsWordReviewGroup marginTopReviewGroup">
                  <div
                    className={`AllTakenAndExamsGroup1 ${
                      displayAllUserTakenIt ? "selectedReviewGroup" : ""
                    }`}
                    onClick={handleAllQuestion}
                  >
                    Group Members
                  </div>
                  <div
                    className={`AllTakenAndExamsGroup2 ${
                      displayAllExamsAssignIt ? "selectedReviewGroup" : ""
                    }`}
                    onClick={handleAnswers}
                  >
                    Exams Assigned
                  </div>
                </div>

                <div
                  className={`MainDivContantGroup ${
                    displayAllUserTakenIt ? "Appear" : "Hidden"
                  }`}
                >
                  <div className="addPadding">
                    <div className="groupMembersRow">
                      <div className="groupMember">Group Members</div>
                      <div className="groupMemberNumber">
                        {StudetnInsideGroupDetails.length}
                      </div>
                    </div>
                    <div className="lineSepreteGroup marginTopGroup"></div>
                    <div className="sectionAddMembersAssigned">
                      {StudetnInsideGroupDetails.length > 0 ? (
                        StudetnInsideGroupDetails.map((student, index) => (
                          <div key={index}>
                            <div key={index} className="GroupMembersContant">
                              <div className="sectionExamNameHome">
                                <img
                                  className="personIcon"
                                  alt=""
                                  src={personIcon}
                                ></img>
                                <div className="ExamNameDiv">
                                  {student["user"].username}
                                </div>
                              </div>
                              <div className="twoButton">
                                <div
                                  className="ButtonResultADelete"
                                  onClick={() =>
                                    handleDeleteMember(student["user"].email)
                                  }
                                >
                                  Remove
                                </div>
                                <Link
                                  to={`/groups/setting/user/?group_id=${group_id}&email=${student["user"].email}`}
                                  className="ButtonResultADelete"
                                >
                                  Result
                                </Link>
                              </div>
                            </div>
                            <div className="lineSepreteGroup"></div>
                          </div>
                        ))
                      ) : (
                        <div className="NoStudent">
                          {" "}
                          No student assigned yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`MainDivContantGroup ${
                    displayAllExamsAssignIt ? "Appear" : "Hidden"
                  }`}
                >
                  <div className="addPadding">
                    <div className="groupMembersRow">
                      <div className="groupMember">Exams Assigned</div>
                      <div className="groupMemberNumber">
                        {ExamsInsideGroupDetails.length}
                      </div>
                    </div>
                    <div className="lineSepreteGroup marginTopGroup"></div>
                    <div className="sectionAddMembersAssigned">
                      {ExamsInsideGroupDetails.length > 0 ? (
                        <>
                          {ExamsInsideGroupDetails.map((ele, index) => (
                            <div className="GroupMembersContant" key={index}>
                              <div className="sectionExamNameHome">
                                <img
                                  className="personIcon"
                                  alt=""
                                  src={file_icon}
                                ></img>
                                <div className="ExamNameDiv">{ele.name}</div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        "No exams assigned to this group yet!"
                      )}
                      <div className="lineSepreteGroup"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDelete}>
              &times;
            </span>
            <p>Are you sure you want to delete this group?</p>
            <div className="button-container-Exams">
              <button onClick={handleDeleteGroupApi}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupSetting;
