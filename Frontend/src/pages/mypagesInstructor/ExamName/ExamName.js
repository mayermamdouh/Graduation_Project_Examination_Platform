import "./ExamName.css";
import Arrow_Right from "../../../Assets/Arrow_Right.svg";

import file_icon from "../../../Assets/file-icon.svg";

import { useState } from "react";

// import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { StepIndicator } from "../component/file";
import { Link } from "react-router-dom";

function ExamSettings() {
  const [isEditExamName, setIsEditExamName] = useState(false);
  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [examName, setExamName] = useState("");

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

  // localStorage.clear("userResponses");
  const examId = uuidv4();
  const handleCreateLocalToStoreQuaestion = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const Response = {
      name: examName,
      examId: examId,
    };
    // console.log(examId);
    const updatedResponses = [...storedResponses, Response];
    // console.log(updatedResponses);
    localStorage.setItem("userResponses", JSON.stringify(updatedResponses));
  };

  return (
    <>
      <div className="MainPageDisplay">
        <div className="Row1">
          <StepIndicator />

          <Link
            to="/ExamName/AddQuaType"
            className="DivNextButton"
            onClick={handleCreateLocalToStoreQuaestion}
          >
            <div className="NextButton">Next</div>
            <img className="ArrowClass" src={Arrow_Right} alt="" />
          </Link>
        </div>
        <div className="MainDivDisplay">
          <div className="TextContnat">Exam Name </div>

          <div className="MainDivContantSettings">
            <div className="ContantSettings paddingName">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExamSettings;
