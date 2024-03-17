import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";
import BoldIcon from "../../../../../../Assets/BoldIcon.png";
import italicIcon from "../../../../../../Assets/italicIcon.png";
import underlineIcon from "../../../../../../Assets/underlineIcon.png";
import strikethroughIcon from "../../../../../../Assets/strikethroughIcon.png";

import ImageIcon from "../../../../../../Assets/ImageIcon.png";
import keyboardIcon from "../../../../../../Assets/keyboardIcon.svg";
import Free_Tect_Icon from "../../../../../../Assets/FreeQuaIcon.svg";
import questionMark from "../../../../../../Assets/questionMark.png";
import iconPlus from "../../../../../../Assets/iconPlus.svg";
import { useRef, useState } from "react";
import { StepIndicator } from "../ChooseQuaType";
import { Link, useLocation } from "react-router-dom";
function FreeText() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");

  const getData = JSON.parse(localStorage.getItem("userResponses"));
 const selectedItem = getData?.[0]?.questions?.[index];


  ////////////////////////////////////////////////////////////
  const [isKeybordOprn, setIsKeybordOprn] = useState(true);
  const [optionalInputCount, setOptionalInputCount] = useState(0);
  // State for the first textarea

  const fileInputRef1 = useRef(null);

  const [file1, setFile1] = useState();
  const [isFoundImage1, setIsFoundImage1] = useState(false);
  const [notTypeImage1, setNotTypeImage1] = useState(false);

  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? `${selectedItem.question}` : ""
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

  // Define the isImageType function
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
    selectedItem ? `${selectedItem.pointsValue}` : ""
  );

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  const saveResponse = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const examId =
      storedResponses.length > 0
        ? storedResponses[storedResponses.length - 1].examId
        : null;
    const allAnswerOptions = [];
    const inputValuee = document.getElementsByClassName("inputFreeText");

    for (let i = 0; i < inputValuee.length; i++) {
      var element = inputValuee[i];
      var inputValue = element.value;
      if (inputValue.trim() !== "") {
        allAnswerOptions.push(inputValue);
      }
    }

    // Create the response object
    const response = {
      type: "Free Text",
      question: textArea1Value,
      pointsValue: PointsValue,
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

  const [answerOptions, setAnswerOptions] = useState(
    selectedItem ? selectedItem.answerOptions.slice(5) : []
  );

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
                  src={Free_Tect_Icon}
                  alt=""
                ></img>
                <div className="TypeOfQuastion">Free Text </div>
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
export default FreeText;
