import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";
import Multiple_Choice from "../../../../../../Assets/Multiple_Choice.svg";

import iconPlus from "../../../../../../Assets/iconPlus.svg";
import questionMark from "../../../../../../Assets/questionMark.png";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StepIndicator } from "../../../../component/file";
import Editor from "../../../../component/TextAreaComponent/Editor";
// import ReactQuill from "react-quill";

function MultipleChoice() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");

  const getData = JSON.parse(localStorage.getItem("userResponses"));
  const selectedItem = getData?.[0]?.questions?.[index];


  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? selectedItem.question : ""
  );
  
  const [textArea2Value, setTextArea2Value] = useState(
    selectedItem ? selectedItem.answer_options[0] : ""
  );
  const [textArea3Value, setTextArea3Value] = useState(
    selectedItem ? selectedItem.answer_options[1] : ""
  );

  // Add More Options
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const AddMoreOPtionFunction = () => {
    setAdditionalOptions((prevOptions) => [...prevOptions, {}]);
  };

  const [PointsValue, setPointsValue] = useState(
    selectedItem ? selectedItem.points : ""
  );

 
  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  // const handleRandomizeChange = (e) => {
  //   setRandomizeValue(e.target.value);
  // };

  const [answerOptions, setAnswerOptions] = useState(
    selectedItem ? selectedItem.answer_options.slice(2) : []
  );

  // Function to handle change in an answer option
  const handleAnswerOptionChange = (index, value) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions[index] = value;
    setAnswerOptions(newAnswerOptions);
  };

 

  const [selectedAnswerValues, setSelectedAnswerVlaues] = useState(
    selectedItem ? selectedItem.correct_answers : []
  );

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?p>/g, "");
  };

    const collectAllAnswerOptions = () => {
      const allOptions = [
        textArea2Value,
        textArea3Value,
        ...answerOptions,
      ];
      additionalOptions.forEach((option) => {
        allOptions.push(option.value);
      });
      return allOptions;
    };

  const saveResponse = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const examId =
      storedResponses.length > 0
        ? storedResponses[storedResponses.length - 1].examId
        : null;

    const allAnswerOptions = collectAllAnswerOptions();

    const response = {
      question_type: "Multiple Choice",
      question: textArea1Value.replace(/<[^>]+>/g, ""),
      points: PointsValue,
      // randomizeValue: RandomizeValue,
      answer_options: allAnswerOptions.map(stripHtmlTags),
      correct_answers: selectedAnswerValues.map(stripHtmlTags),
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

  const handleEditor1Change = (value) => {
    setTextArea1Value(value);
  };
  const handleEditor2Change = (value) => {
    setTextArea2Value(value);
  };
  const handleEditor3Change = (value) => {
    setTextArea3Value(value);
  };

  const handleCheckboxChange = (value) => {
    if (selectedAnswerValues.includes(value)) {
      setSelectedAnswerVlaues(
        selectedAnswerValues.filter((val) => val !== value)
      );
    } else {
      setSelectedAnswerVlaues([...selectedAnswerValues, value]);
    }
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
                  src={Multiple_Choice}
                  alt=""
                ></img>
                <div className="TypeOfQuastion">Multiple choice</div>
              </div>
              <div className="featursTextArea">
                <Editor value={textArea1Value} onChange={handleEditor1Change} />
                {/* <ReactQuill
                  value={textArea1Value}
                  onChange={handleEditor1Change}
                /> */}
              </div>
              <div className="sectionWriteAnswer">
                <div className="textAddoptions margintop">
                  Add you multiple choice answer options
                </div>
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption">
                    <div className="firstRowInOptions">
                      <div className="NumberOptions">(A)</div>
                      <label>
                        <div className="CheckBoxCorrectAnswer">
                          <input
                            className="checkBoxIfCorrect"
                            type="checkbox"
                            name="option1"
                            value={textArea2Value}
                            checked={selectedAnswerValues.includes(
                              textArea2Value
                            )}
                            onChange={() =>
                              handleCheckboxChange(textArea2Value)
                            }
                          />
                          <div className="answerOptionCorrect">
                            This answer option is correct
                          </div>
                        </div>
                      </label>
                      <div className="Madatory">Mandatory</div>
                    </div>
                    <div className="featursTextArea">
                      <Editor
                        value={textArea2Value}
                        onChange={handleEditor2Change}
                      />
                    </div>
                  </div>
                  <div className="textArea1ForAnswOption">
                    <div className="firstRowInOptions">
                      <div className="NumberOptions">(B)</div>
                      <label>
                        <div className="CheckBoxCorrectAnswer">
                          <input
                            className="checkBoxIfCorrect"
                            type="checkbox"
                            name="option2"
                            value={textArea3Value}
                            checked={selectedAnswerValues.includes(
                              textArea3Value
                            )}
                            onChange={() =>
                              handleCheckboxChange(textArea3Value)
                            }
                          />
                          <div className="answerOptionCorrect">
                            This answer option is correct
                          </div>
                        </div>
                      </label>
                      <div className="Madatory">Madatory</div>
                    </div>
                    <div className="featursTextArea">
                      <Editor
                        value={textArea3Value}
                        onChange={handleEditor3Change}
                      />
                    </div>
                  </div>
                  {answerOptions.map((option, index) => (
                    <div className="textArea1ForAnswOption" key={index}>
                      <div className="firstRowInOptions">
                        <div className="NumberOptions">
                          {` (${String.fromCharCode(67 + index)})`}
                        </div>
                        <label>
                          <div className="CheckBoxCorrectAnswer">
                            <input
                              className="checkBoxIfCorrect"
                              type="checkbox"
                              name={`option${index}`}
                              value={option}
                              checked={selectedAnswerValues.includes(option)}
                              onChange={() => handleCheckboxChange(option)}
                            />
                            <div className="answerOptionCorrect">
                              This answer option is correct
                            </div>
                          </div>
                        </label>
                        <div className="Madatory">Optional</div>
                      </div>
                      <div className="featursTextArea">
                        <Editor
                          value={option}
                          onChange={(e) => handleAnswerOptionChange(index, e)}
                        />
                      </div>
                    </div>
                  ))}

                  {additionalOptions.map((option, index) => (
                    <div className="textArea1ForAnswOption" key={index}>
                      <div className="firstRowInOptions">
                        <div className="NumberOptions">
                          {` (${String.fromCharCode(67 + index)})`}
                        </div>
                        <label>
                          <div className="CheckBoxCorrectAnswer">
                            <input
                              className="checkBoxIfCorrect"
                              type="checkbox"
                              name={`additionalOption${index}`}
                              value={option.value}
                              checked={selectedAnswerValues.includes(
                                option.value
                              )}
                              onChange={() =>
                                handleCheckboxChange(option.value)
                              }
                            />
                            <div className="answerOptionCorrect">
                              This answer option is correct
                            </div>
                          </div>
                        </label>
                        <div className="Madatory">Optional</div>
                      </div>
                      <div className="featursTextArea">
                        <Editor
                          value={additionalOptions[index]?.value || ""}
                          onChange={(e) => {
                            const updatedOptions = [...additionalOptions];
                            updatedOptions[index] = { value: e };
                            setAdditionalOptions(updatedOptions);
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div
                    className="AddMoreOPtionSection"
                    onClick={() => AddMoreOPtionFunction()}
                  >
                    <div className="MainDivAddOption">
                      <img className="IconPlus" src={iconPlus} alt="" />
                      <div className="AddMoreOptionText">
                        {" "}
                        Add more answer options{" "}
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
                          <input
                            className="InputRadioTrueandfalse "
                            type="radio"
                            name="choice"
                            value="yes"
                            checked={RandomizeValue === "yes"}
                            onChange={(e) => handleRandomizeChange(e)}
                          />
                          <span className="textRadioRadomize">Yes</span>
                        </label>
                        <label>
                          <input
                            className="InputRadioTrueandfalse "
                            type="radio"
                            name="choice"
                            value="no"
                            checked={RandomizeValue === "no"}
                            onChange={(e) => handleRandomizeChange(e)}
                          />
                          <span className="textRadioRadomize">no</span>
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
              onClick={saveResponse}
              className="ButtonAddNewQuastion"
            >
              save and close this question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default MultipleChoice;
