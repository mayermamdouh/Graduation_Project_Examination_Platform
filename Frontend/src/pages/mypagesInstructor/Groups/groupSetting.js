import { useState } from "react";
import groupIcon from "../../../Assets/groupIconBlack.png";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/AppBar";

function GroupSetting() {
  const [isEditExamName, setIsEditExamName] = useState(false);
  const [editExamNameValue, setEditExamNameValue] = useState("");
  const [examName, setExamName] = useState("");
  const [openAddMember, setOpenAddMember] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExamName = () => {
    setIsEditExamName(!isEditExamName);
  };

  const handleExamNameValue = (e) => {
    setEditExamNameValue(e.target.value);
  };

  const handleAddButtonClickExamName = () => {
    setIsEditExamName(true);
    setExamName(editExamNameValue);
  };

  const handleAddMemberOpen = () => {
    setOpenAddMember(!openAddMember);
  };

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add logic to delete the group here
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="MainDivGroupPage">
        <div className="MainDivDisplay">
          <div className="TextContnat">Exam Settings </div>

          <div className="MainDivContantSettings">
            <div className="addPadding">
              <div className="ContantSettings">
                {isEditExamName ? (
                  <>
                    <div className="sectionExamName" onClick={handleExamName}>
                      <img
                        src={groupIcon}
                        className="iconFile AddPadding"
                        alt=""
                      />
                      <div className="ExamInstructTextAdd">{examName}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="EditExamSectionGroup">
                      <div>Group Name: </div>
                      <input
                        value={editExamNameValue}
                        className="inputEditExam"
                        onChange={handleExamNameValue}
                      />
                      <div className="updateAndCancelButton">
                        <button
                          className="ButtonSaveIntro"
                          //   onClick={handleAddButtonClickExamName}
                        >
                          cancel
                        </button>
                        <button
                          className="ButtonSaveIntro"
                          onClick={handleAddButtonClickExamName}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="groupProperts">
                <div className="properts" onClick={handleAddMemberOpen}>
                  {" "}
                  + Add Members
                </div>
                <div className="lineBettenIt"></div>
                <div className="properts" onClick={handleDeleteGroup}>
                  {" "}
                  Delete Group
                </div>
                <Link className="removeUnderline marginLeft">
                  {" "}
                  <div
                    className="sectionButtonNewExam"
                    // onClick={handleCreateNewGroupSection}
                  >
                    Assign Exam
                  </div>
                </Link>
              </div>
              <div
                className={`AddMemberSection ${
                  openAddMember ? "openAddMember" : "hiddenAddMember"
                }`}
              >
                <div className="blockAddMember">
                  <div className="howToAddStudent">
                    <div>
                      To add a new member, simply tell them to create an
                      account for them on this app and enter their email in the
                      box below.
                    </div>
                    <div className="secionAddUser">
                      <input
                        placeholder="Example: StudentEmail@gmail.com"
                        type="text"
                        className="inputEmailUser"
                      ></input>
                      <Link className="removeUnderline marginLeft hightChange">
                        {" "}
                        <div
                          className="sectionButtonNewExam"
                          // onClick={handleCreateNewGroupSection}
                        >
                          Add
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainDivContantSettings">
            <div className="addPadding">
              <div className="groupMembersRow">
                <div className="groupMember">Group Members</div>
                <div className="groupMemberNumber">100</div>
              </div>
              <div className="lineSeprete"></div>
              <div className="GroupMembersContant">
                No Group Member Added Yet.
              </div>
            </div>
          </div>
        </div>
      </div>


      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDelete}>
              &times;
            </span>
            <p>Are you sure you want to delete this group?</p>
            <div className="button-container">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupSetting;
