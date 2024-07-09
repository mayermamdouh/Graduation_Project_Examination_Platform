import "./ChooseQuaType.css";
import Multiple_Choice from "../../../../../Assets/Multiple_Choice.svg";
// import Match_Answer_Icon from "../../../../../Assets/Match_Answer_Icon.svg";
import Fill_Gap_Icon from "../../../../../Assets/Fill_Gap_Icon.png";
import Essay_Quat_Icon from "../../../../../Assets/Free_Tect_Icon.svg";
import Free_Tect_Icon from "../../../../../Assets/FreeQuaIcon.svg";
import True_False_Icon from "../../../../../Assets/True_False_Icon.png";
import { Link } from "react-router-dom";
import { StepIndicator } from "../../../component/file";

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
              to="/ExamName/AddQuaType/MultipleChoice"
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
           
            <Link to="/ExamName/AddQuaType/FillGabs" className="Box3">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">C</div>
                </div>
                <img className="Mult_Cho_image" src={Fill_Gap_Icon} alt="" />
              </div>
              <div className="textTypeQua"> Fill the gaps</div>
            </Link>
            <Link to="/ExamName/AddQuaType/Essay" className="Box5">
              <div className="Box1Content">
                <div className="appearanceInTypeQua">
                  <div className="textInApper">E</div>
                </div>
                <img className="Mult_Cho_image" src={Essay_Quat_Icon} alt="" />
              </div>
              <div className="textTypeQua"> Essay </div>
            </Link>
            <Link to="/ExamName/AddQuaType/Trueandfalse" className="Box6">
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
