import { useState } from "react";
import "./Types.css";
import Arrow_Right from "../../../../../../Assets/Arrow_Right.svg";

import Fill_Gap_Icon from "../../../../../../Assets/Fill_Gap_Icon.png";
import questionMark from "../../../../../../Assets/questionMark.png";

import { Link, useLocation } from "react-router-dom";
import { StepIndicator } from "../../../../component/file";
import Editor from "../../../../component/TextAreaComponent/Editor";

function FillTheGabs() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = params.get("index");
  const getData = JSON.parse(localStorage.getItem("userResponses"));
  const selectedItem = getData?.[0]?.questions?.[index];


  // Text Area Values
  const [textArea1Value, setTextArea1Value] = useState(
    selectedItem ? `${selectedItem.question}` : ""
  );

  const handlePointsChange = (e) => {
    setPointsValue(e.target.value);
  };

  const [PointsValue, setPointsValue] = useState(
    selectedItem ? `${selectedItem.pointsValue}` : ""
  );
  const saveResponse = () => {
    const storedResponses =
      JSON.parse(localStorage.getItem("userResponses")) || [];
    const examId =
      storedResponses.length > 0
        ? storedResponses[storedResponses.length - 1].examId
        : null;
    const response = {
      type: "Fill Gaps",
      question: textArea1Value,
      pointsValue: PointsValue,
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

  return (
    <>
      <section className="MainSectionMultiple">
        <div className="MainDivMultiple">
          <div className="Row1">
            <Link to="/Home/ExamName/AddQuaType" className="DivNextButton">
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
                  Fill The Gaps (put word {" <<comp>>"} to make complete
                  example: {" << my name is comp?>>"} )
                </div>
              </div>
              <div className="featursTextArea">
                <Editor value={textArea1Value} onChange={handleEditorChange} />
              </div>
              <div className="sectionWriteAnswer">
                <div className="DivAddOptions">
                  <div className="textArea1ForAnswOption"></div>
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
              to="/Home/ExamName/AddQuaType/ExamQuations"
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
