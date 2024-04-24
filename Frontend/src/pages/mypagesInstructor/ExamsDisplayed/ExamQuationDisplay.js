import "./ExamQuations.css";
import Arrow_Right from "../../../Assets/Arrow_Right.svg";
import Arrow_Down from "../../../Assets/iconDownArrow.png";
import deleteIcon from "../../../Assets/iconDeleteColor.svg";
import editIcon from "../../../Assets/iconEditColor.svg";

// import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { StepIndicator } from "../component/file";

function AllExamQuation() {
  //////////////////////////////////////////////////////////////////////////////////
  const [showDetailsArray, setShowDetailsArray] = useState(false);
  const [showDetails, setshowDetails] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////////////////

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

  return (
    <>
      <div className="MainPageDisplay">
        <div className="Row1">
          <div className="MainDivButton"></div>

          <StepIndicator />

          <div className="DivNextButton">
            <div className="NextButton">Next</div>
            <img className="ArrowClass" src={Arrow_Right} alt=""></img>
          </div>
        </div>
        <div className="MainDivDisplay">
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
                          /comp/g,
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
                    to={`/Home/ExamName/AddQuaType/${
                      element.type === "Multiple Choice"
                        ? "MultipleChoice"
                        : element.type === "Fill Gaps"
                        ? "FillGabs"
                        : element.type === "Essay"
                        ? "Essay"
                        : element.type === "Free Text"
                        ? "FreeText"
                        : element.type === "True False"
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
                      Question Type: {element.type}
                    </div>
                    {element.randomizeValue && (
                      <>
                        {" "}
                        <div className="TypeOfQuestion">
                          Randomize Answers: {element.randomizeValue}
                        </div>
                      </>
                    )}
                    {element.pointsValue && (
                      <>
                        {" "}
                        <div className="TypeOfQuestion">
                          Points: {element.pointsValue}
                        </div>
                      </>
                    )}
                  </div>

                  {element.answerOptions &&
                    element.answerOptions.length > 0 && (
                      <ul className="answerOptional">
                        <div className="lineSepreteExamDitalies marginRight"></div>
                        {element.answerOptions.map((choice, choiceindex) => (
                          <div
                            key={choiceindex}
                            className={`Options ${
                              choice === element.selectedAnswer ||
                              element.selectedAnswer?.includes(choice)
                                ? "selected"
                                : ""
                            }`}
                          >
                            {String.fromCharCode(65 + choiceindex)}:{" "}
                            {choice.replace(/<[^>]*>?/gm, "")}
                          </div>
                        ))}
                      </ul>
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

          <Link
            to="/Home/ExamName/AddQuaType"
            // onClick={getExamQuasions}
            className="ButtonAddNewQuastion"
          >
            + Add a new quastion
          </Link>
        </div>
      </div>
    </>
  );
}
export default AllExamQuation;
