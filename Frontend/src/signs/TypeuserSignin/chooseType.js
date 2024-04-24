import "./chooseType.css";
import userIcon from "../../Assets/userIcon.svg";
import schoolicon from "../../Assets/schoolicon.svg";
import { Link } from "react-router-dom";
function TypeLoginPage() {
  return (
    <>
      <section className="MainSectionLogin">
        <div className="MainDivType">
          <Link to="/Home/Login/2
          " className="removeUnderline">
            <div className="MainBlock1">
              <div className="Block1">
                <div className="frame">
                  <img className="userIcon" src={userIcon} alt=""></img>
                </div>
                <div className="TeacherWord">Teacher</div>
                <p className="ParagraphBlock1">
                  Create comprehensive exams with <br /> {} powerful tools that
                  are easy to use <br /> {} and quick to apply.
                </p>
              </div>
            </div>
          </Link>
          <Link to="" className="removeUnderline">
            <div className="MainBlock2">
              <div className="Block2">
                <div className="frame">
                  <img className="userIcon" src={schoolicon} alt=""></img>
                </div>
                <div className="TeacherWord">Student</div>
                <p className="ParagraphBlock1">
                  Create comprehensive exams with <br /> {} powerful tools that
                  are easy to use <br /> {} and quick to apply.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
export default TypeLoginPage;
