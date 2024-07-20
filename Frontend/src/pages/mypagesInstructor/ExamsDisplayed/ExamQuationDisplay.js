import "./ExamQuations.css";
// import Arrow_Right from "../../../Assets/Arrow_Right.svg";
import Arrow_Down from "../../../Assets/iconDownArrow.png";
import deleteIcon from "../../../Assets/iconDeleteColor.svg";
import editIcon from "../../../Assets/iconEditColor.svg";

// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import {
  getAuthHeaders,
  StepIndicator,
} from "../../mypagesInstructor/component/file";

function AllExamQuation() {
  //////////////////////////////////////////////////////////////////////////////////
  const [showDetailsArray, setShowDetailsArray] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [message, setMessage] = useState("");
  ///////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [message]);
  const [getData, setGetData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("userResponses");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const questionsArray = parsedData.flatMap(
        (response) => response.questions
      );
      setGetData(questionsArray);
    } else {
      setGetData([]);
    }
  }, []);

  ///////////////////////////////////////////////////

  const toggleDetails = (index) => {
    setshowDetails(!showDetails);
    setShowDetailsArray((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  ////////////////////////////////////////////////////
  const parsedData = JSON.parse(localStorage.getItem("userResponses"));

  const removeItemByIndex = (index) => {
    if (index >= 0 && index < getData.length) {
      const newData = [...getData];
      newData.splice(index, 1);
      setGetData(newData);

      // Update parsedData to reflect the changes
      const updatedParsedData = parsedData.map((response) => {
        return {
          ...response,
          questions: response.questions.filter((_, i) => i !== index),
        };
      });

      // Update localStorage with the modified parsedData
      localStorage.setItem("userResponses", JSON.stringify(updatedParsedData));
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleEditPage = () => {
    setIsEditOpen(!isEditOpen);
  };

  // console.log("parsedData: ", parsedData);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const handleCreateExam = async () => {
    if (parsedData.length !== 0 && parsedData[0].name) {
      const questionTypeMap = {
        "Multiple Choice": "mcq",
        Essay: "free_text",
      };

      const examData = {
        name: parsedData[0].name,

        questions: parsedData[0].questions.map((q) => {
          const questionType =
            questionTypeMap[q.question_type] ||
            q.question_type.toLowerCase().replace(" ", "_");
          const baseQuestion = {
            question_type: questionType,
            question: q.question,
            points: parseFloat(q.points),
          };

          switch (questionType) {
            case "mcq":
              return {
                ...baseQuestion,
                answer_options: q.answer_options,
                correct_answers: q.correct_answers,
              };
            case "fill_gaps":
              return {
                ...baseQuestion,
                correct_answers: q.correct_answers,
              };
            case "true_false":
              return {
                ...baseQuestion,
                correct_answer: q.correct_answers === "True",
              };
            case "free_text":
              return baseQuestion;
            default: // For any other types, if any
              return baseQuestion;
          }
        }),
      };

      // Retrieve auth tokens from localStorage
      const authTokens = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null;

      // Extract the access token
      const accessToken = authTokens ? authTokens.access : null;
      setShowLoader(true);
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/exam/`,
          examData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setMessage("Exam created successfully");
          localStorage.removeItem("userResponses");
          setShowLoader(false);
          navigate("/Exams");
        } else {
          console.log("Failed to create exam, status code:", response.status);
        }
      } catch (error) {
        console.error("Error creating exam:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    } else if (parsedData.length === 0) {
      setMessage("No questions found in the exam");
    } else {
      setMessage("Exam name not found!");
    }
  };

  // console.log("parsedData: ", parsedData);

  return (
    <>
      <div className="MainPageDisplay">
        {showLoader ? (
          <div className="loaderrr">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="MainDivDisplay">
              <StepIndicator />
              <div className="TextContnat">All Exam questions </div>

              {getData.map((element, index) => (
                <div className="MainDivContant" key={index}>
                  <div className="NumberAndQuation">
                    <div className="RowButtonsDisplay">
                      <div className="NumberOfQuatDisplay">{index + 1}</div>
                    </div>
                    <div className="QuationContant">
                      {element.type === "Fill Gaps" ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: element.question.replace(
                              /blank/g,
                              '<input type="text" class="inputFieldDisplayQuestion" placeholder="Complete" readOnly />'
                            ),
                          }}
                        ></span>
                      ) : (
                        element.question.replace(/<[^>]*>?/gm, "")
                      )}
                    </div>
                    <div className="lineSepreteExamDitalies"></div>
                    <div className="sectionButtons">
                      <div
                        className="ButtonsDisplay"
                        onClick={() => toggleDetails(index)}
                      >
                        <img
                          className="iconDeleteDisplay"
                          src={Arrow_Down}
                          alt=""
                        />
                        Answer
                      </div>
                      <Link
                        to={`/ExamName/AddQuaType/${
                          element.question_type === "Multiple Choice"
                            ? "MultipleChoice"
                            : element.question_type === "Fill Gaps"
                            ? "FillGabs"
                            : element.question_type === "Essay"
                            ? "Essay"
                            : element.question_type === "Free Text"
                            ? "FreeText"
                            : element.question_type === "True False"
                            ? "Trueandfalse"
                            : ""
                        }?index=${index}`}
                        className="ButtonsDisplay"
                      >
                        <img
                          className="iconDeleteDisplay"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEditPage();
                          }}
                          src={editIcon}
                          alt="Edit Icon"
                        />
                        Edit
                      </Link>

                      <div
                        className="ButtonsDisplay"
                        onClick={() => removeItemByIndex(index)}
                      >
                        <img
                          className="iconDeleteDisplay"
                          src={deleteIcon}
                          alt=""
                        />
                        Delete
                      </div>
                    </div>

                    <div
                      className={`sectionApperorNot ${
                        showDetailsArray[index] ? "openDetails" : "closeDetails"
                      }`}
                      key={index}
                    >
                      <div className="charactersiticQuastion">
                        <div className="TypeOfQuestion">
                          Question Type: {element.question_type}
                        </div>

                        {element.points && (
                          <>
                            {" "}
                            <div className="TypeOfQuestion">
                              Points: {element.points}
                            </div>
                          </>
                        )}
                      </div>
                      {element.answer_options &&
                      element.answer_options.length > 0 ? (
                        <ul className="answerOptional">
                          <div className="lineSepreteExamDitalies marginRight"></div>
                          {element.answer_options.map((choice, choiceindex) => (
                            <div
                              key={choiceindex}
                              className={`Options ${
                                choice === element.correct_answers ||
                                element.correct_answers?.includes(choice)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {String.fromCharCode(65 + choiceindex)}:{" "}
                              {choice.replace(/<[^>]*>?/gm, "")}
                            </div>
                          ))}
                        </ul>
                      ) : (
                        <div>
                          {Array.isArray(element?.correct_answers)
                            ? element.correct_answers.map((ele, index) => (
                                <div className="marginAnswer" key={index}>
                                  {" "}
                                  {`Answer ${index + 1}`}: {ele}
                                </div>
                              ))
                            : element?.correct_answers && (
                                <div className="marginAnswer">
                                  {`Answer`} : {element?.correct_answers}{" "}
                                </div>
                              )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {getData.length === 0 && (
                <div className="MainDivContant">
                  <div className="NumberAndQuation">No Questions added yet</div>
                </div>
              )}
              {message ? <div className="messages">{message}</div> : ""}
              <div className="Buttons">
                <Link
                  to="/ExamName/AddQuaType"
                  // onClick={getExamQuasions}
                  className="ButtonsAddNewQuestionAndCreateExam marginRight"
                >
                  + Add a new quastion
                </Link>
                <div
                  className="ButtonsAddNewQuestionAndCreateExam marignleft"
                  onClick={handleCreateExam}
                >
                  Create Exam
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default AllExamQuation;
