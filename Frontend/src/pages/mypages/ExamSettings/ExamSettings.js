import "./ExamSettings.css";
import Arrow_Right from "../../../Assets/Arrow_Right.svg";
import deleteIcon from "../../../Assets/delete.svg";
import previewIcon from "../../../Assets/preview.svg";
import iconPlus from "../../../Assets/iconPlus.svg";
import file_icon from "../../../Assets/file-icon.svg";
import schedule_icon from "../../../Assets/schedule_icon.png";

import icon_time from "../../../Assets/icon_time.svg";
import icon_intro from "../../../Assets/icon_intro.png";
import icon_password from "../../../Assets/icon_password.png";
import { useState } from "react";
import { StepIndicator } from "../QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/ChooseQuaType";
// import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function ExamSettings() {
  const [isWantIntro, setIsWantIntro] = useState(false);
  const [isWantPass, setIsWantPass] = useState(false);
  const [isWantSchedule, setIsWantSchedule] = useState(false);
  const [isWantTimeLimit, setIsWantTimeLimit] = useState(false);
  const [isEditExamName, setIsEditExamName] = useState(false);
  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [examName, setExamName] = useState("");

  const [editExamIntroValue, setEditExamIntroValue] = useState("");

  const [editExamPassValue, setEditExamPassValue] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");
  const [untilTimeLimit, setuntilTimeLimit] = useState("");

  const AddBoxToRightIntroductionn = () => {
    setIsWantIntro(!isWantIntro);
  };

  const AddBoxToRightPassword = () => {
    setIsWantPass(!isWantPass);
  };

  const handleExamName = () => {
    setIsEditExamName(!isEditExamName);
  };

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleAddButtonClickExamName = () => {
    setIsEditExamName(true);
    setExamName(editExamNameValue);
  };
  //////////////////////////////////////////////////////////////////////////////

  const handleIntroValue = (e) => {
    setEditExamIntroValue(e.target.value);
  };

  const handleAddButtonIntro = () => {
    if (editExamIntroValue !== "") {
      setIsWantIntro(!isWantIntro);
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  const handlePassValue = (e) => {
    setEditExamPassValue(e.target.value);
  };

  const handleAddButtonPass = () => {
    if (editExamPassValue) {
      setIsWantPass(!isWantPass);
    }
  };
  ///////////////////////////////////
  const AddBoxToRightSchedule = () => {
    setIsWantSchedule(!isWantSchedule);
  };

  const handleSetButtonAvalibility = () => {
    if (fromDate !== "" && untilDate !== "") {
      setIsWantSchedule(!isWantSchedule);
    }
  };

  //////////////////////////////
  const AddBoxToRightTimeLimit = () => {
    setIsWantTimeLimit(!isWantTimeLimit);
  };

  const handleSetButtonTimeLimit = () => {
    if (untilTimeLimit !== "") {
      setIsWantTimeLimit(!isWantTimeLimit);
    }
  };
  // localStorage.clear("userResponses");
  const examId = uuidv4();
  const handleCreateLocalToStoreQuaestion = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const Response = {
      examName: examName,
      examId: examId,
    };
    console.log(examId);
    const updatedResponses = [...storedResponses, Response];
    console.log(updatedResponses);
    localStorage.setItem("userResponses", JSON.stringify(updatedResponses));
  };

  return (
    <>
      <div className="MainPageDisplay">
        <div className="Row1">
          <StepIndicator />

          <div
            className="DivNextButton"
            onClick={handleCreateLocalToStoreQuaestion}
          >
            <div className="NextButton">Next</div>
            <img className="ArrowClass" src={Arrow_Right} alt=""></img>
          </div>
        </div>
        <div className="MainDivDisplay">
          <div className="TextContnat">Exam Settings </div>

          <div className="MainDivContantSettings">
            <div className="ContantSettings">
              {isEditExamName ? (
                <>
                  <div className="sectionExamName" onClick={handleExamName}>
                    <img src={file_icon} className="iconFile" alt="" />
                    <div className="ExamInstructTextAdd">{examName}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="EditExamSection">
                    <div>Exam Name: </div>
                    <input
                      value={editExamNameValue}
                      className="inputEditExam"
                      onChange={handleExamNameValue}
                    />
                    <button
                      className="ButtonSaveIntro"
                      onClick={handleAddButtonClickExamName}
                    >
                      Add
                    </button>
                  </div>
                </>
              )}

              <div className="ButtonsSettings">
                <button className="EditButtonDetails maginsett">
                  {" "}
                  <img
                    className="iconDeleteDisplay "
                    src={deleteIcon}
                    alt=""
                  ></img>
                  Delete
                </button>
                <button className="EditButtonDetails maginsett">
                  {" "}
                  <img
                    className="iconDeleteDisplay"
                    src={previewIcon}
                    alt=""
                  ></img>
                  Preview
                </button>
              </div>
            </div>
          </div>
          <div className="MainDivContantSettings">
            <div className="ContantSettingsTwo">
              <div className="scheduleTextIcon">
                <img className="iconFile" src={icon_intro} alt=""></img>
                <div className="avaliabilityText">Exam Introduction</div>
              </div>
              <div
                className="sectionAddIns"
                onClick={() => AddBoxToRightIntroductionn()}
              >
                <img src={iconPlus} className="AddInsrationIcon" alt=""></img>
                <div className="ExamInstructTextAdd">Add Introduction</div>
              </div>
              <div className={`AddTextIntro ${isWantIntro ? "" : "hidden"}`}>
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
                <img className="iconFile" src={icon_password} alt=""></img>
                <div className="avaliabilityText">Exam Password</div>
              </div>
              <div
                className="sectionAddIns"
                onClick={() => AddBoxToRightPassword()}
              >
                <img src={iconPlus} className="AddInsrationIcon" alt=""></img>
                <div className="ExamInstructTextAdd">Add Password</div>
              </div>
              <div className={`AddTextIntro ${isWantPass ? "" : "hidden"}`}>
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
                <img className="iconFile" src={schedule_icon} alt=""></img>
                <div className="avaliabilityText">Avaliability</div>
              </div>

              <div
                className="sectionAddIns"
                onClick={() => AddBoxToRightSchedule()}
              >
                <img src={iconPlus} className="AddInsrationIcon" alt=""></img>
                <div className="ExamInstructTextAdd">Add Schedule</div>
              </div>
              <div className={`AddTextIntro ${isWantSchedule ? "" : "hidden"}`}>
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
                <img src={iconPlus} className="AddInsrationIcon" alt=""></img>
                <div className="ExamInstructTextAdd">Add Time Limit</div>
              </div>
              <div
                className={`AddTextIntro ${isWantTimeLimit ? "" : "hidden"}`}
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
        </div>
      </div>
    </>
  );
}

export default ExamSettings;
