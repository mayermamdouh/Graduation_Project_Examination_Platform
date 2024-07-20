import "./ExamDetails.css";

import iconGroup from "../../../Assets/groupIcon.png";
import file_icon from "../../../Assets/file-icon.svg";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/AppBar";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";

function ExamDetails() {
  const [isEditExamName, setIsEditExamName] = useState(true);

  const [editExamNameValue, setEditExamNameValue] = useState("");
    const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const exam_id = searchParams.get("exam_id");

  const handleExamName = () => {
    setIsEditExamName(!isEditExamName);
  };

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleAddButtonClickExamName = () => {
    setIsEditExamName(true);
    handleUpdateExam();
  };

   const handleUpdateExam = async (e) => {
     const formData = new FormData();
     formData.append("name", editExamNameValue);

     try {
       const response = await axios.put(
         `http://127.0.0.1:8000/exam/${exam_id}/`,
         formData,
         { headers: getAuthHeaders() }
       );
       if (response.status === 200 || response.status === 201) {
         setMessage("Group update successfully!");
         handleGetDetailsExam();
       } else {
         console.log("Failed to update group");
       }
     } catch (error) {
       console.error("Error aupdate group:", error.message);
     }
   };

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  const [ExamDetails, setExamDetails] = useState([]);

  useEffect(() => {
    handleGetDetailsExam();
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

  const handleGetDetailsExam = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/exam/${exam_id}/`,
        { headers: getAuthHeaders() }
      );

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        // console.log("Exam get successfully!");
        setExamDetails(response.data);
        // console.log("data: ",response.data);
      } else {
        console.error("Failed to get exam");
      }
    } catch (error) {
      console.error("Error get group:", error.message);
    }
  };

  useEffect(() => {
    // console.log("ExamDetails:", ExamDetails);
  }, [ExamDetails]);

  const handleDeleteExam = async (e) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/exam/${exam_id}/`,
        { headers: getAuthHeaders() }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        // console.log("Exam deleted successfully!");
        setShowDeleteModal(false);
        window.location.href = "/Exams";
      } else {
        console.error("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error.message);
    }
  };


// console.log("id", ExamDetails.id);
  return (
    <>
      <Navbar />
      <div className="sectionExamDetails">
        <div className="MainPageExamDetails">
          {ExamDetails && ExamDetails.name ? (
            <>
              {message ? <div className="messages">{message}</div> : ""}
              <div className="MainDivOfPageExamDetails">
                <div className="TextContnat">Exam Settings </div>
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
                            <div className="ExamInstructTextAdd">
                              {ExamDetails.name || ""}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="EditExamSection">
                            <div>Exam Name: </div>
                            <input
                              value={editExamNameValue || ""}
                              className="inputEditExam"
                              onChange={handleExamNameValue}
                            />
                            <div className="updateAndCancelButton">
                              <button
                                className="ButtonSaveIntro"
                                // onClick={handleAddButtonClickExamName}
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
                    <div className="RowTwo">
                      <Link
                        to={`/Exams?exam_id=${ExamDetails.id}`}
                        className="removeUnderline"
                      >
                        <div className="sectionButtonNewExam AssignColor">
                          Assign Exam
                        </div>
                      </Link>
                      {/* <div className="NumberOfQuastion">4 Questions</div> */}
                      <div
                        className="EditButtonDetails"
                        onClick={handleDeleteGroup}
                      >
                        Delete
                      </div>
                      <div className="EditButtonDetails">Edit Exam</div>
                    </div>
                  </div>
                </div>
                <div className="MainDivAllExamsDetalis">
                  <div className="RowAllExamsOne">
                    <div className="AssignedNumer">
                      Assigned to{" "}
                      <span className="numberGroup">
                        {ExamDetails.group.length}
                      </span>{" "}
                      groups
                    </div>
                  </div>
                  <div className="lineSepreteDetails"></div>
                  {ExamDetails.group.map((ele, index) => (
                    <div key={index}>
                      <div className="RowAllExamsOne">
                        <div className="sectionExamNameHome">
                          <img
                            className="personIcon marginDetalies"
                            alt=""
                            src={iconGroup}
                          />
                          <div className="ExamNameDiv">{ele.name}</div>
                        </div>
                        {/* <div className="twoButton">
                          <div className="sectionButtonNewExam ResultColor">
                            Result
                          </div>
                        </div> */}
                      </div>
                      <div className="lineSepreteDetails hightAssigendUser"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDelete}>
              &times;
            </span>
            <p>Are you sure you want to delete this Exam?</p>
            <div className="button-container-Exams">
              <button onClick={handleDeleteExam}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExamDetails;
