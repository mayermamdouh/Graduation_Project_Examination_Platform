import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";
import Multiple_Choice from "../../../../../../Assets/Multiple_Choice.svg";
import BoldIcon from "../../../../../../Assets/BoldIcon.png";
import italicIcon from "../../../../../../Assets/italicIcon.png";
import underlineIcon from "../../../../../../Assets/underlineIcon.png";
import strikethroughIcon from "../../../../../../Assets/strikethroughIcon.png";
// import subscriptIcon from "../../../../../../Assets/subscriptIcon.png";
import ImageIcon from "../../../../../../Assets/ImageIcon.png";
import keyboardIcon from "../../../../../../Assets/keyboardIcon.svg";
// import UnorderedList from "../../../../../../Assets/UnorderedList.png";
import iconPlus from "../../../../../../Assets/iconPlus.svg";
import questionMark from "../../../../../../Assets/questionMark.png";
import { StepIndicator } from "../ChooseQuaType";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MultipleChoice() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");

  const getData = JSON.parse(localStorage.getItem("userResponses"));
 const selectedItem = getData?.[0]?.questions?.[index];


  //////////////////////////////////////////////
  const [isKeybordOprn, setIsKeybordOprn] = useState(true);

  // State for the first textarea

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const [file1, setFile1] = useState();
  const [isFoundImage1, setIsFoundImage1] = useState(false);
  const [notTypeImage1, setNotTypeImage1] = useState(false);

  // State for the second textarea
  const [file2, setFile2] = useState();
  const [isFoundImage2, setIsFoundImage2] = useState(false);
  const [notTypeImage2, setNotTypeImage2] = useState(false);
  // State for the third textarea
  const [file3, setFile3] = useState();
  const [isFoundImage3, setIsFoundImage3] = useState(false);
  const [notTypeImage3, setNotTypeImage3] = useState(false);
  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? selectedItem.question : ""
  );
  const [textArea2Value, setTextArea2Value] = useState(
    selectedItem ? selectedItem.answerOptions[0] : ""
  );
  const [textArea3Value, setTextArea3Value] = useState(
    selectedItem ? selectedItem.answerOptions[1] : ""
  );
  const [activeTextarea, setActiveTextarea] = useState(null);

  // Event handler for text area 1
  const handleTextArea1Change = (event) => {
    setTextArea1Value(event.target.value);
  };

  // Event handler for text area 2
  const handleTextArea2Change = (event) => {
    setTextArea2Value(event.target.value);
  };

  // Event handler for text area 2
  const handleTextArea3Change = (event) => {
    setTextArea3Value(event.target.value);
  };

  // Add More Options
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const AddMoreOPtionFunction = () => {
    setAdditionalOptions((prevOptions) => [...prevOptions, {}]);
  };

  // Toggle the open/closed state when needed

  const [isTextBold, setIsTextBold] = useState({
    textArea1: false,
    textArea2: false,
    textArea3: false,

    // Add more text areas as needed
  });

  const handleTextBold = (textAreaKey) => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textBold");
    }

    setIsTextBold((prevIsTextBold) => ({
      ...prevIsTextBold,
      [textAreaKey]: !prevIsTextBold[textAreaKey],
    }));
  };

  const [isTextItalic, setIsTextItalic] = useState({
    textArea1: false,
    textArea2: false,
    textArea3: false,
  });

  const handleTextItalic = (textAreaKey) => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textItalic");
    }

    setIsTextItalic((prevIsTextItalic) => ({
      ...prevIsTextItalic,
      [textAreaKey]: !prevIsTextItalic[textAreaKey],
    }));
  };

  const [isTextUnderLine, setIsTextUnderLine] = useState({
    textArea1: false,
    textArea2: false,
    textArea3: false,
  });

  const handleTextUnderLine = (textAreaKey) => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textUnderline");
    }

    setIsTextUnderLine((prevIsTextUnderLine) => ({
      ...prevIsTextUnderLine,
      [textAreaKey]: !prevIsTextUnderLine[textAreaKey],
    }));
  };

  const [isTextstrikethrough, setIsTextstrikethrough] = useState({
    textArea1: false,
    textArea2: false,
    textArea3: false,
  });

  const handleTextstrikethrough = (textAreaKey) => {
    if (activeTextarea) {
      // Apply bold style to the active textarea
      activeTextarea.classList.toggle("textstrikethrough");
    }

    setIsTextstrikethrough((prevIsTextstrikethrough) => ({
      ...prevIsTextstrikethrough,
      [textAreaKey]: !prevIsTextstrikethrough[textAreaKey],
    }));
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

  // Modify handleImage function to include the textareaNumber parameter
  const handleImage = (e, textareaNumber) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && isImageType(selectedFile.type)) {
      switch (textareaNumber) {
        case 1:
          setFile1(URL.createObjectURL(selectedFile));
          setIsFoundImage1(true);
          setNotTypeImage1(false);
          fileInputRef1.current.classList.add("selected");
          break;
        case 2:
          setFile2(URL.createObjectURL(selectedFile));
          setIsFoundImage2(true);
          setNotTypeImage2(false);
          fileInputRef2.current.classList.add("selected");
          break;
        case 3:
          setFile3(URL.createObjectURL(selectedFile));
          setIsFoundImage3(true);
          setNotTypeImage3(false);
          fileInputRef3.current.classList.add("selected");
          break;

        default:
          break;
      }
    } else {
      // Handle invalid file type
      switch (textareaNumber) {
        case 1:
          setNotTypeImage1(true);
          break;
        case 2:
          setNotTypeImage2(true);
          break;
        case 3:
          setNotTypeImage3(true);
          break;

        default:
          break;
      }
    }
  };

  const handleRemoveImage = (textareaNumber) => {
    switch (textareaNumber) {
      case 1:
        setFile1(null);
        setIsFoundImage1(false);

        fileInputRef1.current.classList.remove("selected");
        break;
      case 2:
        setFile2(null);
        setIsFoundImage2(false);
        fileInputRef2.current.classList.remove("selected");
        break;
      case 3:
        setFile3(null);
        setIsFoundImage3(false);
        fileInputRef3.current.classList.remove("selected");
        break;
      // Add more cases for additional text areas as needed
      default:
        break;
    }
  };
  const getIsImageFoundForTextarea = (textareaNumber) => {
    switch (textareaNumber) {
      case 1:
        return isFoundImage1;
      case 2:
        return isFoundImage2;
      case 3:
        return isFoundImage3;

      default:
        return false;
    }
  };
  const handleImageClick = (textareaNumber) => {
    const isImageFound = getIsImageFoundForTextarea(textareaNumber);

    if (isImageFound) {
      handleRemoveImage(textareaNumber);
    } else {
      document.getElementById(`fileInput${textareaNumber}`).click();
    }
  };

  const [PointsValue, setPointsValue] = useState(
    selectedItem ? selectedItem.pointsValue : ""
  );

  const [RandomizeValue, setRandomizeValue] = useState(
    selectedItem ? selectedItem.randomizeValue : ""
  );

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  const handleRandomizeChange = (e) => {
    setRandomizeValue(e.target.value);
  };

  const [answerOptions, setAnswerOptions] = useState(
    selectedItem ? selectedItem.answerOptions.slice(2) : []
  );

  // Function to handle change in an answer option
  const handleAnswerOptionChange = (index, value) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions[index] = value;
    setAnswerOptions(newAnswerOptions);
  };

  const saveResponse = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const examId =
      storedResponses.length > 0
        ? storedResponses[storedResponses.length - 1].examId
        : null;
    const allAnswerOptions = [];
    const inputValuee = document.getElementsByClassName("getItemAnswer");
    for (let i = 0; i < inputValuee.length; i++) {
      var element = inputValuee[i];
      var inputValue = element.value;
      if (inputValue.trim() !== "") {
        allAnswerOptions.push(inputValue);
      }
    }

    const response = {
      type: "Multiple Choice",
      question: textArea1Value,
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
                  src={Multiple_Choice}
                  alt=""
                ></img>
                <div className="TypeOfQuastion">Multiple choice</div>
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
                      className={`featursIcons ${
                        isTextBold.textArea1 ? "selected" : ""
                      }`}
                      onClick={() => handleTextBold("textArea1")}
                      src={BoldIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextItalic.textArea1 ? "selected" : ""
                      }  `}
                      onClick={() => handleTextItalic("textArea1")}
                      src={italicIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextUnderLine.textArea1 ? "selected" : ""
                      }  `}
                      onClick={() => handleTextUnderLine("textArea1")}
                      src={underlineIcon}
                      alt=""
                    ></img>
                    <img
                      className={`featursIcons ${
                        isTextstrikethrough.textArea1 ? "selected" : ""
                      }  `}
                      onClick={() => handleTextstrikethrough("textArea1")}
                      src={strikethroughIcon}
                      alt=""
                    ></img>

                    <div>
                      <input
                        ref={fileInputRef1}
                        id="fileInput1" // Adjust the ID for the first textarea
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleImage(e, 1)} // Pass the textarea number
                      />
                      <label>
                        <img
                          className={`featursIcons ${
                            isFoundImage1 ? "selected" : ""
                          }`}
                          src={ImageIcon}
                          alt=""
                          onClick={() => handleImageClick(1)} // Pass the textarea number
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
                  Add you multiple choice answer options
                </div>
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption">
                    <div className="firstRowInOptions">
                      <div className="NumberOptions">(A)</div>
                      <label className="CheckBoxCorrectAnswer">
                        <input className="checkBoxIfCorrect" type="checkbox" />
                        <span className="answerOptionCorrect">
                          This answer option is correct
                        </span>
                      </label>
                      <div className="Madatory">Mandatory</div>
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
                            className={`featursIcons ${
                              isTextBold.textArea2 ? "selected" : ""
                            }`}
                            onClick={() => handleTextBold("textArea2")}
                            src={BoldIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextItalic.textArea2 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextItalic("textArea2")}
                            src={italicIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextUnderLine.textArea2 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextUnderLine("textArea2")}
                            src={underlineIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextstrikethrough.textArea2 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextstrikethrough("textArea2")}
                            src={strikethroughIcon}
                            alt=""
                          ></img>

                          <div>
                            <input
                              ref={fileInputRef2}
                              id="fileInput2" // Adjust the ID for the second textarea
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => handleImage(e, 2)} // Pass the textarea number
                            />
                            <label>
                              <img
                                className={`featursIcons ${
                                  isFoundImage2 ? "selected" : ""
                                }`}
                                src={ImageIcon}
                                alt=""
                                onClick={() => handleImageClick(2)} // Pass the textarea number
                              ></img>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="textAreaLine"> </div>
                      {isFoundImage2 && (
                        <img
                          src={file2}
                          className={`${isFoundImage2 ? "DivImage " : ""}`}
                          alt=""
                        ></img>
                      )}
                      {notTypeImage2 && (
                        <div className="MessageErrorTypeImage">
                          Please select a valid JPEG, PNG, or JPG image file for
                        </div>
                      )}

                      <textarea
                        className={`textareaMultCho getItemAnswer`}
                        placeholder="Enter your answer.."
                        value={textArea2Value}
                        onChange={handleTextArea2Change}
                        onClick={handleTextareaClick}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="textArea1ForAnswOption">
                    <div className="firstRowInOptions">
                      <div className="NumberOptions">(B)</div>
                      <div className="CheckBoxCorrectAnswer">
                        <input className="checkBoxIfCorrect" type="checkbox" />
                        <div className="answerOptionCorrect">
                          This answer option is correct
                        </div>
                      </div>
                      <div className="Madatory">Madatory</div>
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
                            className={`featursIcons ${
                              isTextBold.textArea3 ? "selected" : ""
                            }`}
                            onClick={() => handleTextBold("textArea3")}
                            src={BoldIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextItalic.textArea3 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextItalic("textArea3")}
                            src={italicIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextUnderLine.textArea3 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextUnderLine("textArea3")}
                            src={underlineIcon}
                            alt=""
                          ></img>
                          <img
                            className={`featursIcons ${
                              isTextstrikethrough.textArea3 ? "selected" : ""
                            }  `}
                            onClick={() => handleTextstrikethrough("textArea3")}
                            src={strikethroughIcon}
                            alt=""
                          ></img>

                          <div>
                            <input
                              id="fileInput3"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => handleImage(e, 3)} // Pass the textarea number
                            />
                            <label>
                              <img
                                ref={fileInputRef3}
                                className={`featursIcons ${
                                  isFoundImage2 ? "selected" : ""
                                }`}
                                src={ImageIcon}
                                alt=""
                                onClick={() => handleImageClick(3)}
                              ></img>
                            </label>
                          </div>
                        </div>
                      </div>
                      {isFoundImage3 && (
                        <img
                          src={file3}
                          className={`${isFoundImage3 ? "DivImage " : ""}`}
                          alt=""
                        ></img>
                      )}
                      {notTypeImage3 && (
                        <div className="MessageErrorTypeImage">
                          Please select a valid JPEG, PNG, or JPG image file for
                        </div>
                      )}

                      <textarea
                        className={`textareaMultCho getItemAnswer`}
                        placeholder="Enter your answer.."
                        value={textArea3Value}
                        onChange={handleTextArea3Change}
                        onClick={handleTextareaClick}
                      ></textarea>
                    </div>
                  </div>
                  {answerOptions.map((option, index) => (
                    <div className="textArea1ForAnswOption" key={index}>
                      <div className="firstRowInOptions">
                        <div className="NumberOptions">
                          {` (${String.fromCharCode(67 + index)})`}
                        </div>
                        <div className="CheckBoxCorrectAnswer">
                          <input
                            className="checkBoxIfCorrect"
                            type="checkbox"
                          />
                          <div className="answerOptionCorrect">
                            This answer option is correct
                          </div>
                        </div>
                        <div className="Madatory">Optional</div>
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
                              className={`featursIcons ${
                                isTextBold[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleTextBold(`textArea${index + 4}`)
                              }
                              src={BoldIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextItalic[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextItalic(`textArea${index + 4}`)
                              }
                              src={italicIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextUnderLine[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextUnderLine(`textArea${index + 4}`)
                              }
                              src={underlineIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextstrikethrough[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextstrikethrough(`textArea${index + 4}`)
                              }
                              src={strikethroughIcon}
                              alt=""
                            ></img>
                          </div>
                        </div>
                        <textarea
                          className={`textareaMultCho  getItemAnswer`}
                          placeholder="Enter your answer.."
                          value={option}
                          onChange={(e) =>
                            handleAnswerOptionChange(index, e.target.value)
                          }
                          onClick={(event) => setActiveTextarea(event.target)}
                        ></textarea>
                      </div>
                    </div>
                  ))}

                  {additionalOptions.map((option, index) => (
                    <div className="textArea1ForAnswOption" key={index}>
                      <div className="firstRowInOptions">
                        <div className="NumberOptions">
                          {` (${String.fromCharCode(67 + index)})`}
                        </div>
                        <div className="CheckBoxCorrectAnswer">
                          <input
                            className="checkBoxIfCorrect"
                            type="checkbox"
                          />
                          <div className="answerOptionCorrect">
                            This answer option is correct
                          </div>
                        </div>
                        <div className="Madatory">Optional</div>
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
                              className={`featursIcons ${
                                isTextBold[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleTextBold(`textArea${index + 4}`)
                              }
                              src={BoldIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextItalic[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextItalic(`textArea${index + 4}`)
                              }
                              src={italicIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextUnderLine[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextUnderLine(`textArea${index + 4}`)
                              }
                              src={underlineIcon}
                              alt=""
                            ></img>
                            <img
                              className={`featursIcons ${
                                isTextstrikethrough[`textArea${index + 4}`]
                                  ? "selected"
                                  : ""
                              }  `}
                              onClick={() =>
                                handleTextstrikethrough(`textArea${index + 4}`)
                              }
                              src={strikethroughIcon}
                              alt=""
                            ></img>
                          </div>
                        </div>
                        <textarea
                          className={`textareaMultCho  getItemAnswer`}
                          placeholder="Enter your answer.."
                          value={additionalOptions[index]?.value || ""}
                          onChange={(e) => {
                            const updatedOptions = [...additionalOptions];
                            updatedOptions[index] = { value: e.target.value };
                            setAdditionalOptions(updatedOptions);
                          }}
                          onClick={(event) => setActiveTextarea(event.target)}
                        ></textarea>
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
