import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";

import Free_Tect_Icon from "../../../../../../Assets/FreeQuaIcon.svg";
import questionMark from "../../../../../../Assets/questionMark.png";
import iconPlus from "../../../../../../Assets/iconPlus.svg";
import { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { StepIndicator } from "../../../../component/file";
import Editor from "../../../../component/TextAreaComponent/Editor";
function FreeText() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");
  const getData = JSON.parse(localStorage.getItem("userResponses"));
  const selectedItem = getData?.[0]?.questions?.[index];

  ////////////////////////////////////////////////////////////

  const [optionalInputCount, setOptionalInputCount] = useState(0);
  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? selectedItem.question : ""
  );

  const addOptionalInput = () => {
    setOptionalInputCount((prevCount) => prevCount + 1);
  };

  const [inputValue1, setinputValue1] = useState(
    selectedItem ? selectedItem.answerOptions[0] : ""
  );
  const [inputValue2, setinputValue2] = useState(
    selectedItem ? selectedItem.answerOptions[1] : ""
  );
  const [inputValue3, setinputValue3] = useState(
    selectedItem ? selectedItem.answerOptions[2] : ""
  );
  const [inputValue4, setinputValue4] = useState(
    selectedItem ? selectedItem.answerOptions[3] : ""
  );
  const [inputValue5, setinputValue5] = useState(
    selectedItem ? selectedItem.answerOptions[4] : ""
  );

  const [PointsValue, setPointsValue] = useState(
    selectedItem ? selectedItem.pointsValue : ""
  );

   const [answerOptions, setAnswerOptions] = useState(
     selectedItem ? selectedItem.answerOptions.slice(5) : []
   );

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

const extractInputValues = () => {
  const allAnswerOptions = [];
  const inputValueElements = document.getElementsByClassName("inputFreeText");

  if (inputValueElements) {
    for (let i = 0; i < inputValueElements.length; i++) {
      const inputValue = inputValueElements[i].value.trim();

      // Check if input value is not empty
      if (inputValue !== "") {
        allAnswerOptions.push(inputValue);
      }
    }
  }

  return allAnswerOptions;
};

   const stripHtmlTags = (html) => {
     return html.replace(/<\/?p>/g, "");
   };

const saveResponse = () => {
  const storedResponses =
    JSON.parse(localStorage.getItem("userResponses")) || [];
  const examId =
    storedResponses.length > 0
      ? storedResponses[storedResponses.length - 1].examId
      : null;
  const allAnswerOptions = extractInputValues();

  // Create the response object
  const response = {
    question_type: "Free Text",
    question: textArea1Value.replace(/<[^>]+>/g, ""),
    points: PointsValue,
    correct_answers: allAnswerOptions.map(stripHtmlTags),
  };
  let updatedResponses = [...storedResponses];
  if (selectedItem) {
    // If editing an existing response, replace it with the new response
    updatedResponses[0].questions[index] = response;
  } else {
    updatedResponses = storedResponses.map((item) => {
      if (item.examId === examId) {
        return {
          ...item,
          questions: [...(item.questions || []), response],
        };
      }
      return item;
    });
  }

  localStorage.setItem("userResponses", JSON.stringify(updatedResponses));
};


  const handleInputChange1 = (e) => {
    setinputValue1(e.target.value);
  };
  const handleInputChange2 = (e) => {
    setinputValue2(e.target.value);
  };
  const handleInputChange3 = (e) => {
    setinputValue3(e.target.value);
  };
  const handleInputChange4 = (e) => {
    setinputValue4(e.target.value);
  };
  const handleInputChange5 = (e) => {
    setinputValue5(e.target.value);
  };



  // Function to handle change in an answer option
  const handleAnswerOptionChange = (index, value) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions[index] = value;
    setAnswerOptions(newAnswerOptions);
  };

  const handleEditorChange = (value) => {
    setTextArea1Value(value);
  };
 

  return (
    <>
      <section className="MainSectionMultiple">
        <div className="MainDivMultiple">
          <div className="Row1">
            <Link to="/ExamName/AddQuaType" className="DivNextButton">
              <img className="ArrowClass BackArrow" src={Arrow_Right} alt="" />
              <div className="NextButtonBack">Back</div>
            </Link>

            <StepIndicator />
          </div>
          <div className="DivMultipleQua">
            <div className="ChildDivMultipleQua">
              <div className="NumberQuation">1</div>
              <div className="MainDivTypeText">
                <img
                  className="Mult_Cho_Icon"
                  src={Free_Tect_Icon}
                  alt=""
                ></img>
                <div className="TypeOfQuastion">Free Text </div>
              </div>
              <div className="featursTextArea">
                <Editor value={textArea1Value} onChange={handleEditorChange} />
              </div>
              <div className="sectionWriteAnswer">
                <div className="textAddoptions">Add Accepted answers</div>
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption">
                    <div className="InputsBlocKForFreeText">
                      <form className="FormBolcksFree">
                        <label className="textAnswerOPtion">Mandatory </label>
                        <input
                          className="inputFreeText"
                          type="text"
                          required
                          value={inputValue1}
                          onChange={handleInputChange1}
                        ></input>
                        <label className="textAnswerOPtion">Optional </label>
                        <input
                          value={inputValue2}
                          onChange={handleInputChange2}
                          className="inputFreeText"
                          type="text"
                        ></input>
                        <label className="textAnswerOPtion">Optional </label>
                        <input
                          value={inputValue3}
                          onChange={handleInputChange3}
                          className="inputFreeText"
                          type="text"
                        ></input>
                        <label className="textAnswerOPtion">Optional </label>
                        <input
                          value={inputValue4}
                          onChange={handleInputChange4}
                          className="inputFreeText"
                          type="text"
                        ></input>
                        <label className="textAnswerOPtion">Optional </label>
                        <input
                          value={inputValue5}
                          onChange={handleInputChange5}
                          className="inputFreeText"
                          type="text"
                        ></input>
                        {answerOptions.map((option, index) => (
                          <div className="AdditonalOptional" key={index}>
                            <label className="textAnswerOPtion">Optional</label>
                            <input
                              className="inputFreeText"
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleAnswerOptionChange(index, e.target.value)
                              }
                            />
                          </div>
                        ))}
                        {[...Array(optionalInputCount)].map((_, index) => (
                          <div className="AdditonalOptional" key={index + 1}>
                            <label className="textAnswerOPtion">Optional</label>
                            <input className="inputFreeText " type="text" />
                          </div>
                        ))}

                        <div
                          className="AddMoreOptionalFree"
                          type="button"
                          onClick={addOptionalInput}
                        >
                          <span className="ButtonText">
                            More Accepted answer options
                          </span>
                          <img
                            className="questionMarkIcon"
                            src={iconPlus}
                            alt=""
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="settingQuastion">
                <div className="questionSettingsText"> Question Settings </div>
                <div className="blockSettings1">
                  <div className="blockSettings2">
                    <div className="classPoints">
                      <div className="pointsText">
                        Points Available{" "}
                        <img
                          className="questionMarkIcon"
                          src={questionMark}
                          alt=""
                        ></img>
                      </div>
                      <input
                        value={PointsValue}
                        type="number"
                        className="numberPointsInput"
                        onChange={(e) => handlePointsChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {selectedItem ? (
            <>
              {" "}
              <div className="MainDivButton">
                <Link
                  to="/ExamName/AddQuaType/ExamQuations"
                  className="ButtonAddNewQuastion"
                  onClick={saveResponse}
                >
                  save
                </Link>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="MainDivButton">
                <Link
                  to="/ExamName/AddQuaType/ExamQuations"
                  className="ButtonAddNewQuastion"
                  onClick={saveResponse}
                >
                  save and close this question
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
export default FreeText;
