// import { useLocation } from "react-router";
import "../studentGroups.css";

import { Link } from "react-router-dom";

import groupIcon from "../../../Assets/groupIcon.png";
import NavBarStudent from "../NavbarStudent";

function StudentPage() {
  // const location = useLocation();
  // const isStepActive = (stepPath) => {
  //   return location.pathname.startsWith(stepPath);
  // };

  return (
    <>
      {/*           NavBar Student */}
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          <div className="MyGroupsWord">My Groups</div>
          <div className="secondMianPageStudent ">
            <img src={groupIcon} className="groupIcon" alt=""></img>
            <div className="NameOfGroup colorAdd"> Name Group </div>
            <Link to="/student/SpecificGroup" className="LinkSpecificGroup">
              <div className="ButtonOprnGroup">open</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPage;
