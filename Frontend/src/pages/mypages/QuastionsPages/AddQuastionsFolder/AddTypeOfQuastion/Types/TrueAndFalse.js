import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";
import BoldIcon from "../../../../../../Assets/BoldIcon.png";
import italicIcon from "../../../../../../Assets/italicIcon.png";
import underlineIcon from "../../../../../../Assets/underlineIcon.png";
import strikethroughIcon from "../../../../../../Assets/strikethroughIcon.png";
// import subscriptIcon from "../../../../../../Assets/subscriptIcon.png";
import ImageIcon from "../../../../../../Assets/ImageIcon.png";
import keyboardIcon from "../../../../../../Assets/keyboardIcon.svg";
// import UnorderedList from "../../../../../../Assets/UnorderedList.png";
import True_False_Icon from "../../../../../../Assets/True_False_Icon.png";
import questionMark from "../../../../../../Assets/questionMark.png";
import { StepIndicator } from "../ChooseQuaType";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function TrueAndFalse() {
  // get all data to sent it to display page

  const [isKeybordOprn, setIsKeybordOprn] = useState(true);

  // State for the first textarea

  const fileInputRef1 = useRef(null);

  const [file1, setFile1] = useState();
  const [isFoundImage1, setIsFoundImage1] = useState(false);
  const [notTypeImage1, setNotTypeImage1] = useState(false);

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
    selectedItem ? selectedItem.selectedAnswer : ""
  );
  const [PointsValue, setPointsValue] = useState(
    selectedItem ? selectedItem.pointsValue : ""
  );
  const [RandomizeValue, setRandomizeValue] = useState(
    selectedItem ? selectedItem.randomizeValue : ""
  );
  const [activeTextarea, setActiveTextarea] = useState(null);

  // Event handler for text area 1
  const handleTextArea1Change = (event) => {
    setTextArea1Value(event.target.value);
  };

  // Toggle the open/closed state when needed

  const [isTextBold, setIsTextBold] = useState(false);

  const handleTextBold = () => {
    if (activeTextarea) {
      activeTextarea.classList.toggle("textBold");
    }
    setIsTextBold(!isTextBold);
  };

  const [isTextItalic, setIsTextItalic] = useState(false);

  const handleTextItalic = () => {
    if (activeTextarea) {
      activeTextarea.classList.toggle("textItalic");
    }

    setIsTextItalic(!isTextItalic);
  };

  const [isTextUnderLine, setIsTextUnderLine] = useState(false);

  const handleTextUnderLine = () => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textUnderline");
    }

    setIsTextUnderLine(!isTextUnderLine);
  };

  const [isTextstrikethrough, setIsTextstrikethrough] = useState(false);

  const handleTextstrikethrough = () => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textstrikethrough");
    }

    setIsTextstrikethrough(!isTextstrikethrough);
  };

  const handleCloseBar = () => {
    setIsKeybordOprn(!isKeybordOprn);
  };

  const handleTextareaClick = (event) => {
    setActiveTextarea(event.target);
  };

  const isImageType = (fileType) => {
    return (
      fileType.startsWith("image/jpeg") ||
      fileType.startsWith("image/png") ||
      fileType.startsWith("image/jpg")
    );
  };

  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && isImageType(selectedFile.type)) {
      setFile1(URL.createObjectURL(selectedFile));
      setIsFoundImage1(true);
      setNotTypeImage1(false);
      fileInputRef1.current.classList.add("selected");
    } else {
      setNotTypeImage1(true);
    }
  };

  const handleRemoveImage = () => {
    setFile1(null);
    setIsFoundImage1(false);

    fileInputRef1.current.classList.remove("selected");
  };

  const handleImageClick = () => {
    if (isFoundImage1) {
      handleRemoveImage();
    } else {
      fileInputRef1.current.click();
    }
  };

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

    const allAnswerOptions = [];
    const inputValuee = document.getElementsByClassName("GetValue");
    for (let i = 0; i < inputValuee.length; i++) {
      const element = inputValuee[i];
      const inputValue = element.value.trim();
      if (inputValue !== "") {
        allAnswerOptions.push(inputValue);
      }
    }

    const response = {
      type: "True False",
      question: textArea1Value,
      selectedAnswer: selectedAnswerValue,
      pointsValue: PointsValue,
      randomizeValue: RandomizeValue,
      answerOptions: allAnswerOptions,
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

  const handleRandomizeChange = (e) => {
    setRandomizeValue(e.target.value);
  };

  return (
    <>
      <section className="MainSectionMultiple">
        <div className="MainDivMultiple">
          <div className="Row1">
            <Link to="/Home/ExamSettings/AddQuaType" className="DivNextButton">
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
              <div className="SectionWrightQuas">
                <div className="featursTextArea">
                  <img
                    className="featursIcons"
                    onClick={() => handleCloseBar()}
                    src={keyboardIcon}
                    alt=""
                  ></img>

                  <div
                    className={`sectionOpenFeaturs ${
                      isKeybordOprn ? "open" : "closed"
                    }`}
                  >
                    <div className="LineKeypord"></div>
                    <img
                      className={`featursIcons ${isTextBold ? "selected" : ""}`}
                      onClick={() => handleTextBold()}
                      src={BoldIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextItalic ? "selected" : ""
                      }  `}
                      onClick={() => handleTextItalic()}
                      src={italicIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextUnderLine ? "selected" : ""
                      }  `}
                      onClick={() => handleTextUnderLine()}
                      src={underlineIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextstrikethrough ? "selected" : ""
                      }  `}
                      onClick={() => handleTextstrikethrough()}
                      src={strikethroughIcon}
                      alt=""
                    ></img>

                    <div>
                      <input
                        ref={fileInputRef1}
                        id="fileInput1" // Adjust the ID for the first textarea
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleImage(e)}
                      />
                      <label>
                        <img
                          className={`featursIcons ${
                            isFoundImage1 ? "selected" : ""
                          }`}
                          src={ImageIcon}
                          alt=""
                          onClick={() => handleImageClick()} // Pass the textarea number
                        ></img>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="textAreaLine"> </div>
                {isFoundImage1 && (
                  <img
                    src={file1}
                    className={`${isFoundImage1 ? "DivImage " : ""}`}
                    alt=""
                  ></img>
                )}
                {notTypeImage1 && (
                  <div className="MessageErrorTypeImage">
                    Please select a valid JPEG, PNG, or JPG image file
                  </div>
                )}

                <textarea
                  className="textareaMultCho"
                  placeholder="Enter your question.."
                  value={textArea1Value}
                  onChange={handleTextArea1Change}
                  onClick={handleTextareaClick}
                  required
                ></textarea>
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
                      <div className="pointsText">
                        Randomize Answers{" "}
                        <img
                          className="questionMarkIcon"
                          src={questionMark}
                          alt=""
                        ></img>
                      </div>
                      <div className="RadmizeInput">
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
                      </div>
                    </div>
                    <div className="classRadomize"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainDivButton">
            <Link
              to="/Home/ExamSettings/AddQuaType/ExamQuations"
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
