// HomePage.js
import React, { useEffect, useState } from "react";

import "./ExamsCss.css";
import Link_icon from "../../../Assets/iconLink.png";
import file_icon from "../../../Assets/file-icon.svg";
import schedule_icon from "../../../Assets/schedule_icon.png";
import icon_time from "../../../Assets/icon_time.svg";
import icon_review from "../../../Assets/iconsreview.png";
import icon_intro from "../../../Assets/icon_intro.png";
import icon_password from "../../../Assets/icon_password.png";
import groupIcon from "../../../Assets/icongroupwhite.png";
import iconPlus from "../../../Assets/iconPlus.svg";
import iconGrade from "../../../Assets/iconGrade.png";
import iconDone from "../../../Assets/iconDone.png";
import Navbar from "../Navbar/AppBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "../component/file";

function Exams() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const exam_idd = searchParams.get("exam_id");

  const [exam_id, setExamId] = useState();

  const [AssigendVriable, setAssigendVriable] = useState(
    exam_idd ? true : false
  );
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
      navigate("/userType");
    } 
  }, []);

  const [valueSearchEngin, setvalueSearchEngin] = useState("");
  const [isAllExams, setIsAllExams] = useState(AssigendVriable ? false : true);
  const [isQuestionBank, setIsQuestionBank] = useState(
    AssigendVriable ? false : false
  );
  const [isAssignExam, setIsAssignExam] = useState(
    AssigendVriable ? true : false
  );
  ////////////////////////////////////////////
  const [isAssignStep1, setIsAssignStep1] = useState(
    AssigendVriable ? false : true
  );
  const [isAssignStep2, setIsAssignStep2] = useState(
    AssigendVriable ? true : false
  );
  const [isAssignStep3, setIsAssignStep3] = useState(false);
  const [isAssignStep4, setIsAssignStep4] = useState(false);

  const removeExamIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("exam_id")) {
      searchParams.delete("exam_id");
    }
  };

  
  const [isWantIntro, setIsWantIntro] = useState(false);
  const [isWantPass, setIsWantPass] = useState(false);
  const [isWantGrades, setIsWantGrades] = useState(false);
  const [editExamDescriptionValue, setEditExamDescriptionValue] = useState("");
  const [editExamPassValue, setEditExamPassValue] = useState("");
  const [editExamGradesValue, setEditExamGradesValue] = useState("");
  const [isWantSchedule, setIsWantSchedule] = useState(false);
  // time avalabilty
  const [fromDate, setFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");
  const [isWantTimeLimit, setIsWantTimeLimit] = useState(false);
  const [isWanStudentReview, setIsWantStudentReview] = useState(false);
  const [sectionGroups, setSectionGroups] = useState(false);
  const [removeButtonGroup, setRemoveButtonGroup] = useState(true);
  const [Exams, setExams] = useState([]);

  const [untilTimeLimit, setuntilTimeLimit] = useState("");

  const handleAssignExam = (examId) => {
    setIsAssignStep1(false);
    setIsAssignStep2(true);
    const newUrl = `${window.location.origin}${window.location.pathname}?exam_id=${examId}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
    setExamId(examId);
  };
  //  useEffect(() => {

  //  }, [isAssignStep2]);

  const AddBoxToRightIntroductionn = () => {
    setIsWantIntro(!isWantIntro);
  };

  const AddBoxToRightPassword = () => {
    setIsWantPass(!isWantPass);
  };

  const AddBoxToRightGrades = () => {
    setIsWantGrades(!isWantGrades);
  };
  const handleIntroValue = (e) => {
    setEditExamDescriptionValue(e.target.value);
  };

  const handlePassValue = (e) => {
    setEditExamPassValue(e.target.value);
  };
  const handleGradesValue = (e) => {
    setEditExamGradesValue(e.target.value);
  };

  const AddBoxToRightSchedule = () => {
    setIsWantSchedule(!isWantSchedule);
  };

  const AddBoxToRightTimeLimit = () => {
    setIsWantTimeLimit(!isWantTimeLimit);
  };

  const AddBoxStudentReview = () => {
    setIsWantStudentReview(!isWanStudentReview);
  };

  const handleSendLink = () => {
    setIsAssignStep3(true);
    setIsAssignStep1(false);
    setIsAssignStep2(false);
  };

  const handleSaveSettings = () => {
    handleUpdateExam();
  };

  const handleAddSectionGroups = () => {
    setSectionGroups(!sectionGroups);
    setRemoveButtonGroup(false);
  };

  const handleNextGroup = () => {
    setIsAssignStep3(true);
    setIsAssignStep1(false);
    setIsAssignStep2(false);
  };

  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleCheckboxChange = (groupCode) => {
    if (selectedGroup === groupCode) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(groupCode);
    }
  };

  useEffect(() => {
    handleViewExams();
  }, []);

  const [showLoader, setShowLoader] = useState(false);
// console.log("", Exams);
  const handleViewExams = async (e) => {
    setShowLoader(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/exam/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200 || response.status === 201) {
        setExams(response.data);
        setShowLoader(false);
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };
  // console.log("Exams: ", Exams);
  const [valueReviewOrNot, setValueReviewOrNot] = useState("");
  const handleTrueFalseChange = (e) => {
    setValueReviewOrNot(e.target.value);
  };

  const [GroupsDetails, setGroupsDetails] = useState([]);
  const handleViewGroups = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/group/", {
        headers: getAuthHeaders(),
      });

      if (response.status === 200 || response.status === 201) {
        setGroupsDetails(response.data);
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };

  useEffect(() => {
    handleViewGroups();
  }, []);

  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdateExam = async (e) => {
    if (
      editExamGradesValue === "" ||
      untilTimeLimit === "" ||
      untilDate === "" ||
      fromDate === ""
    ) {
      let missingValues = "";
      if (editExamGradesValue === "") {
        missingValues += "Exam Total Grades, ";
      }
      if (untilTimeLimit === "") {
        missingValues += "Time Limit, ";
      }
      if (untilDate === "") {
        missingValues += "Avaliable Until, ";
      }
      if (fromDate === "") {
        missingValues += "Avaliable From, ";
      }
      missingValues = missingValues.replace(/,\s*$/, "");
      setMessage(`Some required values ${missingValues} are missing.`);
    } else {
      const payload = {
        description: editExamDescriptionValue,
        password: editExamPassValue,
        starting_date: new Date(fromDate).toISOString(),
        finishing_date: new Date(untilDate).toISOString(),
        duration_minutes: parseInt(untilTimeLimit, 10),
        max_marks: parseInt(editExamGradesValue, 10),
        review: valueReviewOrNot,
      };
      // Retrieve auth tokens from localStorage
      const authTokens = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null;

      // Extract the access token
      const accessToken = authTokens ? authTokens.access : null;
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/exam/${exam_idd ? exam_idd : exam_id}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          setMessage("Exam update success");
          handleAssignExamApi();
        } else {
          console.log("Failed to update group");
        }
      } catch (error) {
        console.error("Error updating group:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    }
  };

  const handleAssignExamApi = async () => {
    // console.log('selected group:',selectedGroup)
    if (selectedGroup) {
      const formData = new FormData();
      formData.append("group_code", selectedGroup);
       const authTokens = localStorage.getItem("authTokens")
         ? JSON.parse(localStorage.getItem("authTokens"))
         : null;

       // Extract the access token
       const accessToken = authTokens ? authTokens.access : null;
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/exam/${exam_idd ? exam_idd : exam_id}/group/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setMessage("Exam Assigned successfully");
          setIsAssignStep1(false);
          setIsAssignStep2(false);
          setIsAssignStep3(false);
          setIsAssignStep4(true);
        } else {
          console.error("Failed to assign exam to group");
        }
      } catch (error) {
        console.error("Error assigning exam to group:", error.message);
      }
    } else {
      setMessage("No group code available to assign exam.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="BodyExams">
        <div className="MainPage">
          <div className="MainDivOfPage">
            {message ? <div className="messages">{message}</div> : ""}
            <div className="stepHomee">
              <div
                className={`ItemOne ${
                  isAllExams ? "activeHome activeUnderline" : ""
                }`}
                onClick={() => {
                  setIsAllExams(true);
                  setIsQuestionBank(false);
                  setIsAssignExam(false);
                  ////////////////////////////////
                  setAssigendVriable(false);
                  setIsAssignStep1(true);
                  setIsAssignStep2(false);
                  removeExamIdFromUrl();
                }}
              >
                All Exams
              </div>
              <div
                className={`ItemOne ${
                  isAssignExam ? "activeHome activeUnderline" : ""
                }`}
                onClick={() => {
                  setIsAllExams(false);
                  setIsQuestionBank(false);
                  setIsAssignExam(true);
                  setIsAssignStep1(true);
                  setIsAssignStep2(false);
                  setIsAssignStep3(false);
                  setIsAssignStep4(false);
                }}
              >
                Assign
              </div>
              <div
                className={`ItemTwo ${
                  isQuestionBank ? "activeHome activeUnderline" : ""
                }`}
                onClick={() => {
                  setIsAllExams(false);
                  setIsQuestionBank(true);
                  setIsAssignExam(false);
                  ////////////////////////////////
                  setAssigendVriable(false);
                  setIsAssignStep1(true);
                  setIsAssignStep2(false);
                  removeExamIdFromUrl();
                }}
              >
                Question Bank
              </div>

              <div className="ItemFour">Ai Detection</div>
            </div>
            <div
              className={`MainDivAllExams ${isAllExams ? "appear" : "hidden"}`}
            >
              <div className="RowAllExamsOne">
                <input
                  className="SearchEnginAllExam"
                  placeholder="Search Exam Name.."
                  value={valueSearchEngin}
                  onChange={(e) => setvalueSearchEngin(e.target.value)}
                ></input>
                <Link to="/ExamName" className="removeUnderline">
                  {" "}
                  <div className="sectionButtonNewExam">
                    <div className="iconPlueNewExam">+</div>
                    <div>New Exam</div>
                  </div>
                </Link>
              </div>
              {showLoader ? (
                <div className="loaderrr">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  {Exams.length > 0 ? (
                    <>
                      {Exams.map((exam, index) => (
                        <div key={index}>
                          <div className="lineSeprete"></div>
                          <div className="RowAllExamsOne">
                            <div className="sectionExamNameHome">
                              <img
                                className="iconFile"
                                alt=""
                                src={file_icon}
                              ></img>
                              <div className="ExamNameDiv">{exam.name}</div>
                            </div>
                            <div className="twoButton">
                              <Link
                                to={`/Exams/ExamDetails?exam_id=${exam.id}`}
                                className="sectionButtonNewExam"
                              >
                                Open
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="noExamsAdd">No exams added yet</div>
                  )}
                </>
              )}
            </div>

            <div
              className={`MainDivAllExams ${
                isQuestionBank ? "appear" : "hidden"
              }`}
            >
              <div className="RowAllExamsOne">
                <input
                  className="SearchEnginAllExam"
                  placeholder="Search Question Bank.."
                  value={valueSearchEngin}
                  onChange={(e) => setvalueSearchEngin(e.target.value)}
                ></input>
                <div className="NumberOfQuestion">4 Questions </div>
                <div className="sectionButtonNewExam">
                  <div className="iconPlueNewExam">+</div>
                  <div> Add Question </div>
                </div>
              </div>
              <div className="lineSeprete"></div>
              <div>No Question add yet</div>
            </div>
            <div
              className={`MainDivAssign ${isAssignExam ? "appear" : "hidden"}`}
            >
              <div className="step_indicator_home">
                <div
                  className={`step_home ${
                    isAssignStep1 ||
                    isAssignStep2 ||
                    isAssignStep3 ||
                    isAssignStep4
                      ? "active_home"
                      : ""
                  }`}
                >
                  1
                </div>
                <div
                  className={`line_home ${
                    isAssignStep2 ||
                    isAssignStep3 ||
                    isAssignStep4 ||
                    AssigendVriable
                      ? "active_line"
                      : ""
                  }`}
                ></div>
                <div
                  className={`step_home ${
                    isAssignStep2 ||
                    isAssignStep3 ||
                    isAssignStep4 ||
                    AssigendVriable
                      ? "active_home "
                      : ""
                  }`}
                >
                  2
                </div>
                <div
                  className={`line_home ${
                    isAssignStep3 || isAssignStep4 ? "active_line " : ""
                  }`}
                ></div>
                <div
                  className={`step_home ${
                    isAssignStep3 || isAssignStep4 ? "active_home " : ""
                  }`}
                >
                  3
                </div>
                <div
                  className={`line_home ${isAssignStep4 ? "active_line" : ""}`}
                >
                  {" "}
                </div>
                <div
                  className={`step_home ${isAssignStep4 ? "active_home " : ""}`}
                >
                  4
                </div>
              </div>
              <div
                className={`sectionsIsAssignStep1 directionColumn ${
                  isAssignStep1 ? "appaer" : "hidden"
                }`}
              >
                {/* exam_id=28 */}
                <div className="statmentAssign">Select a Exam to Assign it</div>
                {Exams.length > 0 ? (
                  <>
                    {Exams.map((exam, index) => (
                      <div className="MainDivAllExams " key={index}>
                        <div className="sectionDisplayEA">
                          <div className="rowAssignText">
                            <div className="nameOfExam">{exam.name}</div>
                            <div
                              className="assignText"
                              onClick={() => handleAssignExam(exam.id)}
                            >
                              Assign this Exam
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="NoExams">No exams created yet</div>
                )}
              </div>
              <div
                className={`sectionsIsAssignStep1 ${
                  isAssignStep2 ? "appaer" : "hidden"
                }`}
              >
                <div className="MainDivAssignStep2">
                  <div className="contnatAssignStep2">
                    <div className="sectionLink">
                      <img className="iconLink" src={Link_icon} alt=""></img>
                    </div>
                    <div className="textInBlockAssign">
                      <div className="sentLinkText ">Send a Link</div>
                      <div className="sentLinkText userRegistration">
                        User Must Registration
                      </div>
                      <div className="sentLinkText sendTheOne">
                        Send one Link to all your users.
                      </div>
                    </div>

                    <div className="LineAssignLink"></div>
                    <div className="sectionButtonLink">
                      <div className="secTwoButton">
                        <div
                          className="buttonSentLink"
                          onClick={handleSendLink}
                        >
                          Send a Link
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="MainDivAssignStep2">
                  <div className="contnatAssignStep2">
                    <div className="sectionLink">
                      <img className="iconLink" src={groupIcon} alt=""></img>
                    </div>
                    <div className="textInBlockAssign">
                      <div className="sentLinkText ">Send to a Group</div>
                      <div className="sentLinkText userRegistration">
                        User Must Registration
                      </div>
                      <div className="sentLinkText sendTheOne">
                        Group members will log in and have access to all the
                        exams created in this group.
                      </div>
                    </div>

                    <div className="LineAssignLink"></div>
                    <div className="sectionButtonLink">
                      {removeButtonGroup ? (
                        <div className="secTwoButton">
                          <div
                            readOnly
                            className="buttonSentLink"
                            // onClick={handleSendLink}
                            onClick={handleAddSectionGroups}
                          >
                            Send to Group
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      className={`sectiongroup ${
                        sectionGroups ? "apper" : "hidden"
                      }`}
                    >
                      <div>- Select Groups</div>
                      {GroupsDetails.length > 0 ? (
                        <>
                          {GroupsDetails.map((group, index) => (
                            <div className="groups" key={index}>
                              <div className="itemInGroups">
                                <label className="label">
                                  <input
                                    type="checkbox"
                                    id={`checkbox-${index}`}
                                    checked={selectedGroup === group.code}
                                    onChange={() =>
                                      handleCheckboxChange(group.code)
                                    }
                                    className="checkBoxIfCorrect"
                                  />

                                  <div>{group.name}</div>
                                </label>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        "Don't have any groups"
                      )}
                      <div className="wordCreateGrpup">+ Create New Group</div>
                      <div className="NextButton">
                        <div
                          readOnly
                          className="secTwoButton"
                          onClick={handleNextGroup}
                        >
                          Next
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`sectionsIsAssignStep1 ${
                  isAssignStep3 ? "appaer" : "hidden"
                }`}
              >
                <div className="MainDivAssignStep3">
                  <div className="MainDivContantSettings margindown">
                    <div className="ContantSettingsTwo">
                      <div className="scheduleTextIcon">
                        <img className="iconFile" src={icon_intro} alt=""></img>
                        <div className="avaliabilityText">
                          Exam Description{" "}
                          <span className="optionalFields">(optional)</span>
                        </div>
                      </div>
                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxToRightIntroductionn()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">
                          Add Description
                        </div>
                      </div>
                      <div
                        className={`AddTextIntro ${
                          isWantIntro ? "" : "hidden"
                        }`}
                      >
                        <input
                          value={editExamDescriptionValue}
                          className="InputIntro"
                          placeholder="Write Your Intro..."
                          onChange={handleIntroValue}
                        ></input>
                        {/* <button
                          className="ButtonSaveIntro marginSettings"
                          onClick={handleAddButtonIntro}
                        >
                          Add
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings margindown">
                    <div className="ExamPasswordSection">
                      <div className="scheduleTextIcon">
                        <img
                          className="iconFile"
                          src={icon_password}
                          alt=""
                        ></img>
                        <div className="avaliabilityText">
                          Exam Password{" "}
                          <span className="optionalFields">(optional)</span>
                        </div>
                      </div>
                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxToRightPassword()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">Add Password</div>
                      </div>
                      <div
                        className={`AddTextIntro ${isWantPass ? "" : "hidden"}`}
                      >
                        <input
                          value={editExamPassValue}
                          className="InputIntro width"
                          placeholder="Write Your Password..."
                          onChange={handlePassValue}
                        ></input>
                      </div>
                    </div>
                  </div>

                  <div className="MainDivContantSettings margindown">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img
                          className="iconFile"
                          src={schedule_icon}
                          alt=""
                        ></img>
                        <div className="avaliabilityText">
                          Avaliability{" "}
                          <span className="optionalFields">(Mandatory)</span>
                        </div>
                      </div>

                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxToRightSchedule()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">Add Schedule</div>
                      </div>
                      <div
                        className={`AddTextIntro ${
                          isWantSchedule ? "" : "hidden"
                        }`}
                      >
                        <div className="sectionPutTheTime">
                          <div className="RowTime">
                            <label className="textTime">Avaliable from:</label>
                            <input
                              className="inputTime"
                              type="datetime-local"
                              id="date"
                              name="date"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            ></input>
                          </div>

                          <div className="RowTime">
                            <label className="textTime">Avaliable until:</label>
                            <input
                              className="inputTime marginAvaliableUntil"
                              type="datetime-local"
                              id="time"
                              name="time"
                              value={untilDate}
                              onChange={(e) => setUntilDate(e.target.value)}
                            ></input>
                          </div>
                          {/* <button
                            className="ButtonSaveIntro marginSettings"
                            onClick={handleSetButtonAvalibility}
                          >
                            Set
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings margindown">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img className="iconFile" src={icon_time} alt=""></img>
                        <div className="avaliabilityText">
                          Time Limit
                          <span className="optionalFields"> (Mandatory)</span>
                        </div>
                      </div>

                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxToRightTimeLimit()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">
                          Add Time Limit
                        </div>
                      </div>
                      <div
                        className={`AddTextIntro ${
                          isWantTimeLimit ? "" : "hidden"
                        }`}
                      >
                        <div className="sectionTimeLimit">
                          <div className="textMinutes">Minutes: </div>
                          <input
                            type="number"
                            className="inputTimeLimit"
                            value={untilTimeLimit}
                            onChange={(e) => setuntilTimeLimit(e.target.value)}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings margindown">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img
                          className="iconFile"
                          src={icon_review}
                          alt=""
                        ></img>
                        <div className="avaliabilityText">
                          Student Review Result
                          <span className="optionalFields"> (Mandatory)</span>
                        </div>
                      </div>

                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxStudentReview()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">Review</div>
                      </div>
                      <div
                        className={`AddTextIntro ${
                          isWanStudentReview ? "" : "hidden"
                        }`}
                      >
                        <div className="TrueFalseSetting">
                          <div className="textalignSetting">
                            <input
                              type="radio"
                              value="True"
                              id={`answer_true`}
                              className="radiosetting"
                              checked={valueReviewOrNot === "True"}
                              onChange={(e) => handleTrueFalseChange(e)}
                            />
                            <label
                              htmlFor={`answer_true`}
                              className="valueTrueFalsesetting"
                            >
                              Review
                            </label>
                          </div>
                          <div className="textalignSetting">
                            <input
                              type="radio"
                              value="False"
                              id={`answer_false`}
                              className="radiosetting"
                              checked={valueReviewOrNot === "False"}
                              onChange={(e) => handleTrueFalseChange(e)}
                            />
                            <label
                              htmlFor={`answer_false`}
                              className="valueTrueFalsesetting"
                            >
                              Not Review
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings margindown">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img className="iconFile" src={iconGrade} alt=""></img>
                        <div className="avaliabilityText">
                          Exam Total Grades
                          <span className="optionalFields"> (Mandatory)</span>
                        </div>
                      </div>

                      <div
                        className="sectionAddIns"
                        onClick={() => AddBoxToRightGrades()}
                      >
                        <img
                          src={iconPlus}
                          className="AddInsrationIcon"
                          alt=""
                        ></img>
                        <div className="ExamInstructTextAdd">Grades</div>
                      </div>

                      <div
                        className={`AddTextIntro ${
                          isWantGrades ? "" : "hidden"
                        }`}
                      >
                        <input
                          value={editExamGradesValue}
                          className="InputIntro width"
                          placeholder="Write Total Grades..."
                          onChange={handleGradesValue}
                          type="number"
                        ></input>
                      </div>
                    </div>
                  </div>
                  {message ? <div className="messages">{message}</div> : ""}
                  <div className="sectionButton" onClick={handleSaveSettings}>
                    <div className="textButtonsave">Assign</div>
                  </div>
                </div>
              </div>
              <div
                className={`sectionsIsAssignStep1 ${
                  isAssignStep4 ? "appaer" : "hidden"
                }`}
              >
                <div className="MainDivAssignStep2">
                  <div className="contnatAssignStep2">
                    <div className="sectionAssignFour">
                      <div className="sectionDone">
                        <img className="iconDone" src={iconDone} alt=""></img>
                        <div className="textGive">
                          {" "}
                          Your Exam is Assigned to Group Successfully!
                        </div>
                        {/* <div className="examNamesection">
                          <img
                            className="iconExamName"
                            src={file_icon}
                            alt=""
                          ></img>
                          <div>
                            {Exams.map((exam, index) => (
                              <div key={index}>
                                {(exam.id === exam_id ||
                                  exam.id === exam_idd) && (
                                  <div className="nameExams">{exam.name}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Exams;
