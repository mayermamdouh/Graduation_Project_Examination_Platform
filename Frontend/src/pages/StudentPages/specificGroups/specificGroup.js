import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBarStudent from "../NavbarStudent";
import axios from "axios";
import { useEffect, useState } from "react";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";

function SpecificGroup() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const group_id = searchParams.get("group_id");

  const [Exams, setExams] = useState([]);
  const [Loder, setLoder] = useState(false);
  const [showWritePassword, setShowWritePassword] = useState(false);
  const [PassValue, setPassValue] = useState("");
  const [examidValue, setExamidValue] = useState("");
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
      navigate("/userType");
    }
  }, []);
  const handlePassValue = (e) => {
    setPassValue(e.target.value);
  };

  const handleViewPassword = (id, hasPassword) => {
    if (hasPassword) {
      setExamidValue(id);
      setShowWritePassword(true);
    } else {
      openExamWithoutPassword(id);
    }
  };

  const handleCancelDelete = () => {
    setExamidValue("");
    setShowWritePassword(false);
  };

  const handleViewGroupExams = async () => {
    setLoder(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/student/group/${group_id}/exams/`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 200 || response.status === 201) {

        setExams(response.data);
        setLoder(false);
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };

  const handleAttempteExam = async () => {
    const examidValuee = examidValue;

    if (examidValuee) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/student/exam/${examidValue}/`,
          { password: PassValue },
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.status === 200 || response.status === 201) {
          // console.log("handle Attempte Exam: ", response.data);
          if (response.data && response.data.exam_details) {
            const examDetails = encodeURIComponent(
              JSON.stringify(response.data)
            );
            window.location.href = `/student/SpecificGroup/exam?exam_details=${examDetails}`;
          }
        } else {
          console.log("Failed to assign student");
        }
      } catch (error) {
        console.error("Error assign student:", error.message);
      }
    }
  };

  const openExamWithoutPassword = async (examId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/student/exam/${examId}/`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        // console.log("Open Exam Without Password: ", response.data);
        if (response.data && response.data.exam_details) {
          const examDetails = encodeURIComponent(JSON.stringify(response.data));
          window.location.href = `/student/SpecificGroup/exam?exam_details=${examDetails}`;
        }
      } else {
        console.log("Failed to open exam");
      }
    } catch (error) {
      console.error("Error opening exam:", error.message);
    }
  };

  useEffect(() => {
    handleViewGroupExams();
  }, []);

  const getCurrentStatus = (startingDate, finishingDate) => {
    const currentTime = new Date().toISOString();
    return currentTime >= startingDate && currentTime <= finishingDate
      ? "Open"
      : "Closed";
  };

  return (
    <>
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          <div className="NameOFGroup">
            <div className="GroupWord"> Group</div>
            <div className="NameGroup"> MATH102</div>
          </div>
          <div className="MyGroupsWord">All Exams</div>
          <div className="MianPageStudentTests">
            <div className="notExceedWidth">
              {Loder ? (
                <div className="loaderrr">
                  <div className="loader"></div>
                </div>
              ) : (
                <table className="examsTable">
                  <thead>
                    <tr>
                      <th>Name Exam</th>
                      <th>Status</th>
                      <th>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Exams.map((exam, index) => (
                      <tr key={index}>
                        <td>{exam.name}</td>
                        <td>
                          <div
                            onClick={() =>
                              handleViewPassword(exam.id, exam.password)
                            }
                            className="NameOfGroupStudentButton"
                          >
                            {getCurrentStatus(
                              exam.starting_date,
                              exam.finishing_date
                            )}
                          </div>
                        </td>
                        <td>
                          <Link
                            className="NameOfGroupStudentButton"
                            to={`/student/SpecificGroup/Review?exam_id=${exam.id}`}
                          >
                            {exam.review ? "Allow" : "Not Allow"}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {showWritePassword && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDelete}>
              &times;
            </span>
            <p>Write the password for this exam?</p>
            <div className="boxToWritePassword">
              <div>Password: </div>
              <input
                value={PassValue}
                className="Inputpassexam"
                placeholder="Write Your Password..."
                onChange={handlePassValue}
              ></input>
            </div>
            <div className="button-container-Exams">
              <button onClick={handleAttempteExam}>open</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SpecificGroup;
