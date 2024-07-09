import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";

import True_False_Icon from "../../../../../../Assets/True_False_Icon.png";
import questionMark from "../../../../../../Assets/questionMark.png";
import Editor from "../../../../component/TextAreaComponent/Editor";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StepIndicator } from "../../../../component/file";

function TrueAndFalse() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");

  const getData = JSON.parse(localStorage.getItem("userResponses"));
  const selectedItem = getData?.[0]?.questions?.[index];

  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? selectedItem.question : ""
  );
  const [selectedAnswerValue, setSelectedAnswerVlaue] = useState(
    selectedItem ? selectedItem.correct_answers : ""
  );
  const [PointsValue, setPointsValue] = useState(
    selectedItem ? selectedItem.points : ""
  );
 

  // Function to save user response for this question type
  const saveResponse = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const examId =
      storedResponses.length > 0
        ? storedResponses[storedResponses.length - 1].examId
        : null;

    if (!examId) {
      console.error("No exam ID found. Please create an exam first.");
      return;
    }

    


    const response = {
      question_type: "True False",
      question: textArea1Value.replace(/<[^>]+>/g, ""),
      correct_answers: selectedAnswerValue,
      points: PointsValue,
     
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

  const handleRadioChange = (event) => {
    setSelectedAnswerVlaue(event.target.value);
  };

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  // const handleRandomizeChange = (e) => {
  //   setRandomizeValue(e.target.value);
  // };

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
                  src={True_False_Icon}
                  alt=""
                ></img>
                <div className="TypeOfQuastion">True & False </div>
              </div>

              <div className="featursTextArea">
                <Editor value={textArea1Value} onChange={handleEditorChange} />
              </div>

              <div className="sectionWriteAnswer">
                <div className="textAddoptions">
                  Add you True & False answer options
                </div>
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption">
                    <div>
                      <div className="sectionAnserTrueAndFalse">
                        <label>
                          <div className="MainDivLabel">
                            <input
                              className="InputRadioTrueandfalse GetValue"
                              type="radio"
                              name="choicee"
                              value="True"
                              checked={selectedAnswerValue === "True"}
                              onChange={handleRadioChange}
                            />
                            <span className="textRadioTrueandfalse">
                              This answer is correct
                            </span>
                          </div>
                        </label>
                        <input
                          className="inputTrueAndFalse"
                          type="text"
                          value="True"
                          readOnly
                          disabled
                        ></input>
                        <label>
                          <div className="MainDivLabel">
                            <input
                              className="InputRadioTrueandfalse GetValue"
                              type="radio"
                              name="choicee"
                              value="False"
                              checked={selectedAnswerValue === "False"}
                              onChange={handleRadioChange}
                            />
                            <span className="textRadioTrueandfalse">
                              This answer is correct
                            </span>
                          </div>
                        </label>
                        <input
                          className="inputTrueAndFalse"
                          value="False"
                          type="text"
                          readOnly
                          disabled
                        ></input>
                      </div>
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
                        onChange={(e) => {
                          handlePointsChange(e);
                        }}
                        value={PointsValue}
                        type="number"
                        className="numberPointsInput"
                      />
                    </div>
                    <div className="RadomizeSection">
                      {/* <div className="pointsText">
                        Randomize Answers{" "}
                        <img
                          className="questionMarkIcon"
                          src={questionMark}
                          alt=""
                        ></img>
                      </div> */}
                      {/* <div className="RadmizeInput">
                        <label>
                          <div>
                            <div className="MainDivLabel">
                              <input
                                className="InputRadioTrueandfalse "
                                type="radio"
                                name="choice"
                                value="yes"
                                checked={RandomizeValue === "yes"}
                                onChange={(e) => handleRandomizeChange(e)}
                              />
                              <span className="textRadioRadomize">Yes</span>
                            </div>
                          </div>
                        </label>
                        <label>
                          <div className="MainDivLabel">
                            <input
                              className="InputRadioTrueandfalse "
                              type="radio"
                              name="choice"
                              value="no"
                              checked={RandomizeValue === "no"}
                              onChange={(e) => handleRandomizeChange(e)}
                            />
                            <span className="textRadioRadomize">no</span>
                          </div>
                        </label>
                      </div> */}
                    </div>
                    <div className="classRadomize"></div>
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

export default TrueAndFalse;
