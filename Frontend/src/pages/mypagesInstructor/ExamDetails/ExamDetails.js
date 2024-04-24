import "./ExamDetails.css";

import iconPerson from "../../../Assets/iconPerson.png";
import file_icon from "../../../Assets/file-icon.svg";

import { useState } from "react";
import { Link } from "react-router-dom";

function ExamDetails() {
  const [isEditExamName, setIsEditExamName] = useState(true);

  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [examName, setExamName] = useState("name");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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

    const handleDeleteGroup = () => {
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
      // Add logic to delete the group here
      setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
    };
    
const Exam_id = 123456789;

 
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
                  <Link
                    to={{
                      pathname: "/Exams",
                      search: `?Exam_id=${Exam_id}`,
                    }}
                    className="removeUnderline"
                  >
                    <div className="sectionButtonNewExam AssignColor">
                      Assign Exam
                    </div>
                  </Link>

                  <div className="EditButtonDetails PreviweColor">
                    {" "}
                    Edit Exam{" "}
                  </div>
                  <div className="EditButtonDetails">
                    <div className="" onClick={handleDeleteGroup}>
                      {" "}
                      Delete{" "}
                    </div>
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
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDelete}>
              &times;
            </span>
            <p>Are you sure you want to delete this Exam?</p>
            <div className="button-container">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExamDetails;
