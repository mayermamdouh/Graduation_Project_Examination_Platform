import { Link } from "react-router-dom";
import NavBarStudent from "../NavbarStudent";

function SpecificGroup() {
  return (
    <>
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          <div className="NameOFGroup">
            <div className="GroupWord"> Group</div>
            <div className="NameGroup"> MATH102</div>
          </div>
          <div className="MyGroupsWord">All Tests</div>
          <div className="MianPageStudentTests ">
            <div className="notExceedWidth">
              <div className="firstRowStudent">
                <div className="NameOfGroup"> Name Exam </div>
                {/* <div className="NameOfGroup"> Percentage </div> */}
                {/* <div className="NameOfGroup"> Score </div> */}
                {/* <div className="NameOfGroup"> Duration </div> */}
                <div className="NameOfGroup"> Status </div>
                {/* <div className="NameOfGroup"> Grade </div> */}
                <div className="NameOfGroup"> Review </div>
              </div>
              <div className="LineStudentTest"></div>

              <div className="sectionRepetedTests">
                <div className="firstRowStudent marginTop">
                  <div className="NameOfGroupStudent"> Quiz MATH100 </div>
                  {/* <div className="NameOfGroupStudent"> 100% </div> */}
                  {/* <div className="NameOfGroupStudent"> 30/30 </div> */}
                  {/* <div className="NameOfGroupStudent"> 00:00:04 </div> */}
                  <div className="NameOfGroupStudent"> Closed </div>
                  {/* <div className="NameOfGroupStudent"> 15 </div> */}
                  <Link
                    to={"/student/SpecificGroup/Review"}
                    className="classRemoveLinKcss"
                  >
                    <div className="NameOfGroupStudentButton"> Review </div>
                  </Link>
                </div>
                <div className="LineStudentTest"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecificGroup;
