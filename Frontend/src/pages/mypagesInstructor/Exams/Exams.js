// HomePage.js
import React, { useState } from "react";

import "./ExamsCss.css";
import Link_icon from "../../../Assets/iconLink.png";
import file_icon from "../../../Assets/file-icon.svg";
import schedule_icon from "../../../Assets/schedule_icon.png";

import icon_time from "../../../Assets/icon_time.svg";

import icon_intro from "../../../Assets/icon_intro.png";
import icon_password from "../../../Assets/icon_password.png";
import groupIcon from "../../../Assets/groupIcon.png";
import iconPlus from "../../../Assets/iconPlus.svg";
import iconDone from "../../../Assets/iconDone.png";
import Navbar from "../Navbar/AppBar";
import { Link, useLocation } from "react-router-dom";

function Exams() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const Assigned = searchParams.get("Exam_id");
  const [AssigendVriable, setAssigendVriable] = useState(
    Assigned ? true : false
  );

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
    if (searchParams.has("Exam_id")) {
      searchParams.delete("Exam_id");
      // const newSearch = searchParams.toString();
      // const newUrl = `${window.location.pathname}${
      //   newSearch ? `?${newSearch}` : ""
      // }`;
      // window.history.pushState({}, "", newUrl);
    }
  };
  // console.log(
  //   isAssignStep1,
  //   isAssignStep2,
  //   isAssignStep3,
  //   isAssignStep4,
  //   AssigendVriable
  // );
  const [isWantIntro, setIsWantIntro] = useState(false);
  const [isWantPass, setIsWantPass] = useState(false);
  const [editExamIntroValue, setEditExamIntroValue] = useState("");
  const [editExamPassValue, setEditExamPassValue] = useState("");
  const [isWantSchedule, setIsWantSchedule] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [isWantTimeLimit, setIsWantTimeLimit] = useState(false);
  const [sectionGroups, setSectionGroups] = useState(false);
  const [removeButtonGroup, setRemoveButtonGroup] = useState(true);

  const [untilDate, setUntilDate] = useState("");
  const [untilTimeLimit, setuntilTimeLimit] = useState("");
  const handleAssignExam = () => {
    setIsAssignStep1(false);
    setIsAssignStep2(true);
  };
  const AddBoxToRightIntroductionn = () => {
    setIsWantIntro(!isWantIntro);
  };

  const AddBoxToRightPassword = () => {
    setIsWantPass(!isWantPass);
  };
  const handleIntroValue = (e) => {
    setEditExamIntroValue(e.target.value);
  };

  const handleAddButtonIntro = () => {
    if (editExamIntroValue !== "") {
      setIsWantIntro(!isWantIntro);
    }
  };

  const handlePassValue = (e) => {
    setEditExamPassValue(e.target.value);
  };

  const handleAddButtonPass = () => {
    if (editExamPassValue) {
      setIsWantPass(!isWantPass);
    }
  };

  const AddBoxToRightSchedule = () => {
    setIsWantSchedule(!isWantSchedule);
  };
  const handleSetButtonAvalibility = () => {
    if (fromDate !== "" && untilDate !== "") {
      setIsWantSchedule(!isWantSchedule);
    }
  };
  const AddBoxToRightTimeLimit = () => {
    setIsWantTimeLimit(!isWantTimeLimit);
  };
  const handleSetButtonTimeLimit = () => {
    if (untilTimeLimit !== "") {
      setIsWantTimeLimit(!isWantTimeLimit);
    }
  };

  const handleSendLink = () => {
    setIsAssignStep3(true);
    setIsAssignStep1(false);
    setIsAssignStep2(false);
  };
  const handleSaveSettings = () => {
    setIsAssignStep1(false);
    setIsAssignStep2(false);
    setIsAssignStep3(false);
    setIsAssignStep4(true);
  };

  const handleAddSectionGroups = () => {
    setSectionGroups(!sectionGroups);
    setRemoveButtonGroup(false);
  };

  const [isChecked1, setIsChecked1] = useState(false);

  const handleItemClick1 = () => {
    setIsChecked1(!isChecked1);
  };

  const [isChecked2, setIsChecked2] = useState(false);

  const handleItemClick2 = () => {
    setIsChecked2(!isChecked2);
  };

  return (
    <>
      <Navbar />
      <div className="BodyExams">
        <div className="MainPage">
          <div className="MainDivOfPage">
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
              <div className="ItemThere">Files</div>
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
                <Link to="/Home/ExamName" className="removeUnderline">
                  {" "}
                  <div className="sectionButtonNewExam">
                    <div className="iconPlueNewExam">+</div>
                    <div>New Exam</div>
                  </div>
                </Link>
              </div>
              <div className="lineSeprete"></div>
              <div className="RowAllExamsOne">
                <div className="sectionExamNameHome">
                  <img className="iconFile" alt="" src={file_icon}></img>
                  <div className="ExamNameDiv">Exam name</div>
                </div>

                <div className="twoButton">
                  <Link
                    to="/Exams/ExamDetails"
                    className="sectionButtonNewExam"
                  >
                    Open
                  </Link>
                  {/* <div className="sectionButtonNewExam"> Edit Exam </div>
                  <div className="sectionButtonNewExam"> Attempts </div> */}
                </div>
              </div>
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
                <div className="statmentAssign">Select a Exam to Assign it</div>
                <div className="MainDivAllExams ">
                  <div className="sectionDisplayEA">
                    <div className="rowAssignText">
                      <div className="nameOfExam">Exam Name</div>
                      <div
                        className="assignText"
                        onClick={() => handleAssignExam()}
                      >
                        Assign this Exam
                      </div>
                    </div>
                  </div>
                </div>
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
                        tests Created in this Group.
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
                      <div className="groups">
                        <div
                          className="itemInGroups"
                          onClick={handleItemClick1}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked1}
                            readOnly
                            className="checkBoxIfCorrect"
                          ></input>
                          <div>Name of Group 1</div>
                        </div>
                        <div
                          className="itemInGroups"
                          onClick={handleItemClick2}
                        >
                          <input
                            type="checkbox"
                            className="checkBoxIfCorrect"
                            checked={isChecked2}
                            readOnly
                          ></input>
                          <div>Name of Group 2</div>
                        </div>
                        <div className="wordCreateGrpup">
                          + Create New Group
                        </div>
                        <div className="LineAssignLink"></div>

                        <div className="NextButton">
                          <div readOnly className="secTwoButton">
                            Next
                          </div>
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
                  <div className="MainDivContantSettings">
                    <div className="ContantSettingsTwo">
                      <div className="scheduleTextIcon">
                        <img className="iconFile" src={icon_intro} alt=""></img>
                        <div className="avaliabilityText">
                          Exam Introduction
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
                          Add Introduction
                        </div>
                      </div>
                      <div
                        className={`AddTextIntro ${
                          isWantIntro ? "" : "hidden"
                        }`}
                      >
                        <input
                          value={editExamIntroValue}
                          className="InputIntro"
                          placeholder="Write Your Intro..."
                          onChange={handleIntroValue}
                        ></input>
                        <button
                          className="ButtonSaveIntro marginSettings"
                          onClick={handleAddButtonIntro}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings">
                    <div className="ExamPasswordSection">
                      <div className="scheduleTextIcon">
                        <img
                          className="iconFile"
                          src={icon_password}
                          alt=""
                        ></img>
                        <div className="avaliabilityText">Exam Password</div>
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
                          className="InputIntro"
                          placeholder="Write Your Password..."
                          onChange={handlePassValue}
                        ></input>
                        <button
                          className="ButtonSaveIntro marginSettings"
                          onClick={handleAddButtonPass}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="MainDivContantSettings">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img
                          className="iconFile"
                          src={schedule_icon}
                          alt=""
                        ></img>
                        <div className="avaliabilityText">Avaliability</div>
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
                          <button
                            className="ButtonSaveIntro marginSettings"
                            onClick={handleSetButtonAvalibility}
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="MainDivContantSettings">
                    <div className="sectionAvaliability">
                      <div className="scheduleTextIcon">
                        <img className="iconFile" src={icon_time} alt=""></img>
                        <div className="avaliabilityText">Time Limit</div>
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
                        <button
                          className="ButtonSaveIntro marginSettings"
                          onClick={handleSetButtonTimeLimit}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sectionButton" onClick={handleSaveSettings}>
                    <div className="textButtonsave">Save</div>
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
                          Your Exam is ready to give!
                        </div>
                        <div className="examNamesection">
                          <img
                            className="iconExamName"
                            src={file_icon}
                            alt=""
                          ></img>
                          <div>Exam Name </div>
                        </div>
                        <div className="textGive">
                          {" "}
                          Use the Link below to give access to your Exam.
                        </div>
                        <input
                          value="https://en.wikipedia.org/wiki/Local_outlier_factor"
                          className="linkContant"
                          type="text"
                          readOnly
                        ></input>
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
