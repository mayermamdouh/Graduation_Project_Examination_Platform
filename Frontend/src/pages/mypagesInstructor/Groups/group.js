import { useState } from "react";
import "./group.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/AppBar";
import groupIcon from "../../../Assets/groupIconBlack.png";
// import editIcon from "../../../Assets/edit.svg";
function Groups() {
  const [valueSearchEngin, setvalueSearchEngin] = useState("");

  //   const [isEditExamName, setIsEditExamName] = useState(false);
  const [editExamNameValue, setEditExamNameValue] = useState("");
  //   const [examName, setExamName] = useState("");
  const [createGroup, setCreateGroup] = useState(false);

  //   const handleExamName = () => {
  //     setIsEditExamName(!isEditExamName);
  //   };

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleAddButtonClickExamName = () => {
    // setIsEditExamName(true);
    // setExamName(editExamNameValue);
    setCreateGroup(false);
  };

  const handleCreateNewGroupSection = () => {
    setCreateGroup(true);
  };
  return (
    <>
      <Navbar />
      <div className="MainDivGroupPage">
    
          <div className={`MainPageGroup ${createGroup ? "" : "hidden"}`}>
            <div className="MainDivOfPage">
              <div className="MainDivAllExams padding">
                <div className="ContantSettings">
                  <>
                    <div className="EditExamSectionGroup">
                      <div>Group Name: </div>
                      <input
                        value={editExamNameValue}
                        className="inputEditExam"
                        onChange={handleExamNameValue}
                      />

                      <button
                        className="ButtonSaveIntro marginLeft"
                        onClick={handleAddButtonClickExamName}
                      >
                        Create Group
                      </button>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
       
     
          <div className={`MainPageGroup ${createGroup ? "hidden" : ""}`}>
            <div className="MainDivOfPage">
              <div className="MainDivAllExams padding">
                <div className="RowAllExamsOne">
                  <input
                    className="SearchEnginAllExam"
                    placeholder="Search Exam Groups.."
                    value={valueSearchEngin}
                    onChange={(e) => setvalueSearchEngin(e.target.value)}
                  ></input>
                  <Link className="removeUnderline">
                    {" "}
                    <div
                      className="sectionButtonNewExam"
                      onClick={handleCreateNewGroupSection}
                    >
                      <div className="iconPlueNewExam">+</div>
                      <div>New Group</div>
                    </div>
                  </Link>
                </div>
                <div className="lineSeprete"></div>
                <div className="RowAllExamsOne">
                  <div className="sectionExamNameHome">
                    <img
                      className="iconFile AddPadding"
                      alt=""
                      src={groupIcon}
                    ></img>
                    <div className="ExamNameDiv">group name</div>
                  </div>

                  <Link to="/groups/setting" className="AssignButton">
                    Setting Group
                  </Link>
                </div>
              </div>
            </div>
          </div>
  
      </div>
    </>
  );
}

export default Groups;
