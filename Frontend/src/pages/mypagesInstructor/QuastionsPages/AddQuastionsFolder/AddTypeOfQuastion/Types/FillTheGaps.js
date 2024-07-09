import { useState } from "react";
import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";

import Fill_Gap_Icon from "../../../../../../Assets/Fill_Gap_Icon.png";
import questionMark from "../../../../../../Assets/questionMark.png";

import { Link, useLocation } from "react-router-dom";
import { StepIndicator } from "../../../../component/file";
import Editor from "../../../../component/TextAreaComponent/Editor";
import { useEffect } from "react";

function FillTheGabs() {
  const { search } = useLocation();
  const params = new URLSearchParams(search || "");
  const index = params.get("index");
  const getData = JSON.parse(localStorage.getItem("userResponses"));
  const selectedItem = getData?.[0]?.questions?.[index];

  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? selectedItem.question : ""
  );

  const countOccurrences = (string, subString) => {
    // Escape special characters in the subString and create a regular expression
    const escapedSubString = subString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSubString, "g");

    // Use match method to find all occurrences of the subString in the string
    const matches = string.match(regex);

    // Return the count of matches
    return matches ? matches.length : 0;
  };

  const [answerOptions, setAnswerOptions] = useState(
    selectedItem ? selectedItem.correct_answers : []
  );

  useEffect(() => {
    const updateAnswerOptions = () => {
      const occurrences = countOccurrences(textArea1Value, "....."); //example 2 have two complete two of '.....'
      setAnswerOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        // if 2 < answerOptions.length this mean number of answers greater than number of '.....'

        if (occurrences < newOptions.length) {
          // this will take number of answers to = number of '.....'
          newOptions.splice(occurrences);
        } else if (occurrences > newOptions.length) {
          // if number of '.....' greater than number of answerOptions increase one input
          for (let i = newOptions.length; i < occurrences; i++) {
            newOptions.push("");
          }
        }
        return newOptions;
      });
    };

    updateAnswerOptions();
  }, [textArea1Value]);

  // Text Area Values
  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  const [PointsValue, setPointsValue] = useState(
    selectedItem ? `${selectedItem.points}` : ""
  );

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
    const response = {
      question_type: "Fill Gaps",
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

  const handleEditorChange = (value) => {
    setTextArea1Value(value);
  };
  // Function to handle change in an answer option
  const handleAnswerOptionChange = (index, value) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions[index] = value;
    setAnswerOptions(newAnswerOptions);
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
                <img className="Mult_Cho_Icon" src={Fill_Gap_Icon} alt=""></img>
                <div className="TypeOfQuastion">
                  Fill The Gaps (put 5 dot <span>.....</span> to make complete
                  example: {" << my name is .....?>>"} )
                </div>
              </div>
              <div className="featursTextArea">
                <Editor value={textArea1Value} onChange={handleEditorChange} />
              </div>
              <div className="sectionWriteAnswer">
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption">
                    {answerOptions.map((option, index) => (
                      <div className="AdditonalOptional" key={index}>
                        <label className="textAnswerOPtion">
                          Complete Answer {index + 1}
                        </label>
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
                        onChange={(e) => {
                          handlePointsChange(e);
                        }}
                        value={PointsValue}
                        type="number"
                        className="numberPointsInput"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainDivButton">
            <Link
              to="/ExamName/AddQuaType/ExamQuations"
              className="ButtonAddNewQuastion"
              onClick={saveResponse}
            >
              save and close this question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default FillTheGabs;
