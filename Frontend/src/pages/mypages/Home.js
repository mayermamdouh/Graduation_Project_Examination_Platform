// HomePage.js
import React, { useState } from "react";

import "./HomeCss.css";
import file_icon from "../../Assets/file-icon.svg";
import Navbar from "./Navbar/AppBar";
import { Link } from "react-router-dom";

function HomePage() {
  const [valueSearchEngin, setvalueSearchEngin] = useState("");
  const [isAllExams, setIsAllExams] = useState(true);
  const [isQuestionBank, setIsQuestionBank] = useState(false);

  return (
    <>
      <Navbar />
      <div className="BodyHome">
        <div className="MainPage">
          <div className="MainDivOfPage">
            <div className="stepHome">
              <div
                className={`ItemOne ${
                  isAllExams ? "activeHome activeUnderline" : ""
                }`}
                onClick={() => {
                  setIsAllExams(true);
                  setIsQuestionBank(false);
                }}
              >
                All Exams
              </div>
              <div
                className={`ItemTwo ${
                  isQuestionBank ? "activeHome activeUnderline" : ""
                }`}
                onClick={() => {
                  setIsAllExams(false);
                  setIsQuestionBank(true);
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
                <Link to="/Home/ExamSettings">
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
                  <Link to="/Home/ExamDetails" className="sectionButtonNewExam">
                    Open
                  </Link>
                  {/* <div className="sectionButtonNewExam"> Edit Exam </div>
                  <div className="sectionButtonNewExam"> Attempts </div> */}
                </div>
              </div>
            </div>

            <>
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
                  <div className="sectionButtonNewExam">
                    <div className="iconPlueNewExam">+</div>
                    <div> Add Question </div>
                  </div>
                </div>
                <div className="lineSeprete"></div>
                <div>No Question add yet</div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
