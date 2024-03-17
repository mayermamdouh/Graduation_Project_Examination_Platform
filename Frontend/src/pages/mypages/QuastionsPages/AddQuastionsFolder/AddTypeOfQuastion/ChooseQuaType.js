import "./ChooseQuaType.css";
// import Arrow_Right from "../../../../../Assets/Arrow_Right.svg";
import Multiple_Choice from "../../../../../Assets/Multiple_Choice.svg";
import Match_Answer_Icon from "../../../../../Assets/Match_Answer_Icon.svg";
import Fill_Gap_Icon from "../../../../../Assets/Fill_Gap_Icon.png";
import Essay_Quat_Icon from "../../../../../Assets/Free_Tect_Icon.svg";
import Free_Tect_Icon from "../../../../../Assets/FreeQuaIcon.svg";
import True_False_Icon from "../../../../../Assets/True_False_Icon.png";
import { Link, useLocation } from "react-router-dom";

function ChoosesQuaType() {
  return (
    <>
      <section className="MainSectionQuaType">
        <div className="MainDivForTypeSection">
          <div className="Row1">
            <StepIndicator />
          </div>
          <div className="DivForTypes">
            <Link
              to="/Home/ExamSettings/AddQuaType/MultipleChoice"
              className="Box1"
            >
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">A</div>
                </div>
                <img className="Mult_Cho_image" src={Multiple_Choice} alt="" />
              </div>
              <div className="textTypeQua"> Multiple choice</div>
            </Link>
            <div className="Box2">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">B</div>
                </div>
                <img
                  className="Mult_Cho_image"
                  src={Match_Answer_Icon}
                  alt=""
                ></img>
              </div>
              <div className="textTypeQua"> Match answer</div>
            </div>
            <Link to="/Home/ExamSettings/AddQuaType/FillGabs" className="Box3">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">C</div>
                </div>
                <img className="Mult_Cho_image" src={Fill_Gap_Icon} alt="" />
              </div>
              <div className="textTypeQua"> Fill the gaps</div>
            </Link>
            <Link to="/Home/ExamSettings/AddQuaType/FreeText" className="Box4">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">D</div>
                </div>
                <img className="Mult_Cho_image" src={Free_Tect_Icon} alt="" />
              </div>
              <div className="textTypeQua"> Free text</div>
            </Link>
            <Link to="/Home/ExamSettings/AddQuaType/Essay" className="Box5">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">E</div>
                </div>
                <img className="Mult_Cho_image" src={Essay_Quat_Icon} alt="" />
              </div>
              <div className="textTypeQua"> Essay </div>
            </Link>
            <Link
              to="/Home/ExamSettings/AddQuaType/Trueandfalse"
              className="Box6"
            >
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">G</div>
                </div>
                <img className="Mult_Cho_image" src={True_False_Icon} alt="" />
              </div>
              <div className="textTypeQua"> True & False </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
export default ChoosesQuaType;

export function StepIndicator() {
  const location = useLocation();

  // Define a function to determine if a step is active based on the path
  const isStepActive = (stepPath) => {
    return location.pathname.startsWith(stepPath);
  };

  return (
    <div className="step-indicator">
      <div
        className={`step ${isStepActive("/Home/ExamSettings") ? "active" : ""}`}
      >
        1
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType") ? "active" : ""
        }`}
      >
        2
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType/MultipleChoice") ||
          isStepActive("/Home/ExamSettings/AddQuaType/Trueandfalse") ||
          isStepActive("/Home/ExamSettings/AddQuaType/Essay") ||
          isStepActive("/Home/ExamSettings/AddQuaType/FreeText") ||
          isStepActive("/Home/ExamSettings/AddQuaType/FillGabs") ||
          isStepActive("/Home/ExamSettings/AddQuaType/ExamQuations")
            ? "active"
            : ""
        }`}
      >
        3
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType/ExamQuations")
            ? "active"
            : ""
        }`}
      >
        4
      </div>
    </div>
  );
}
