import "./ExamDetails.css";

import iconPerson from "../../../Assets/iconPerson.png";
import file_icon from "../../../Assets/file-icon.svg";
import editIcon from "../../../Assets/edit.svg";
import { useState } from "react";

function ExamDetails() {
  const [isEditExamName, setIsEditExamName] = useState(true);

  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [examName, setExamName] = useState("name");
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
  return (
    <>
      <div className="sectionExamDetails">
        <div className="MainPageExamDetails">
          <div className="MainDivOfPageExamDetails">
            <div className="MainDivAllExamsDetalis AddmarginBotton">
              <div className="RowExamDetails">
                <div className="RowOne">
                  {isEditExamName ? (
                    <>
                      <div
                        className="sectionExamNameDetails"
                        onClick={handleExamName}
                      >
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
                <div className="RowTwo">
                  <div className="sectionButtonNewExam AssignColor">
                    {" "}
                    Assign Exam{" "}
                  </div>

                  <div className="EditButtonDetails PreviweColor">
                    {" "}
                    Preview{" "}
                  </div>
                  <div className="EditButtonDetails">
                    <img src={editIcon} className="EditIcon" alt=""></img>
                    <div className=""> Edit Exam </div>
                  </div>
                  <div className="NumberOfQuastion"> 4 Questions</div>
                </div>
              </div>
            </div>
            <div className="MainDivAllExamsDetalis">
              <div className="RowAllExamsOne">
                <div className="AssignedNumer">
                  Assigned <span>2</span> times
                </div>
              </div>

              <div className="lineSepreteDetails"></div>

              <div className="RowAllExamsOne">
                <div className="sectionExamNameHome">
                  <img
                    className="iconFile marginDetalies"
                    alt=""
                    src={iconPerson}
                  ></img>
                  <div className="ExamNameDiv">Name of Assigned</div>
                </div>

                <div className="twoButton">
                  <div className="sectionButtonNewExam ResultColor">
                    {" "}
                    Result{" "}
                  </div>
                </div>
              </div>
              <div className="lineSepreteDetails hightAssigendUser"></div>
              <div className="RowAllExamsOne">
                <div className="sectionExamNameHome">
                  <img
                    className="iconFile marginDetalies"
                    alt=""
                    src={iconPerson}
                  ></img>
                  <div className="ExamNameDiv">Name of Assigned</div>
                </div>

                <div className="twoButton">
                  <div className="sectionButtonNewExam ResultColor">
                    {" "}
                    Result{" "}
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

export default ExamDetails;
