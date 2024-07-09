import { useEffect, useState } from "react";
import PhotoUser from "../../../Assets/photoUser.png";
import personIcon from "../../../Assets/person.png";
import { useLocation } from "react-router-dom";
import Arrow_Down from "../../../Assets/iconDownArrow.png";
import axios from "axios";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";
import Navbar from "../Navbar/AppBar";
function ResultAndInformation() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentDetailsSubmission, setStudentDetailsSubmission] = useState([]);
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get("group_id");
  const email = searchParams.get("email");
  const [transformedExamDetails, setTransformedExamDetails] = useState(null);
  const [showGradeAndAnswers, setShowGradeAndAnswers] = useState(false);
  const [showDetailsArray, setShowDetailsArray] = useState({});
  const [grades, setGrades] = useState({});
  const [examId, setExamId] = useState("");

  const handleViewStudentDetails = async () => {
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/group/${groupId}/student/`,
        formData,
        { headers: getAuthHeaders() }
      );

      if (response.status === 200 || response.status === 201) {
        setStudentDetails(response.data);
      } else {
        console.error("Failed to assign exam to group");
      }
    } catch (error) {
      console.error("Error assigning exam to group:", error.message);
    }
  };

  useEffect(() => {
    handleViewStudentDetails();
  }, []);

  const transformExamDetails = (data) => {
    const addTypeToQuestions = (questions, type) => {
      return (questions || []).map((question) => ({
        ...question,
        type,
      }));
    };

    return {
      questions: [
        ...addTypeToQuestions(data["MCQ Questions"], "multiple_choice"),
        ...addTypeToQuestions(data["Fillgaps Questions"], "fill_gaps"),
        ...addTypeToQuestions(data["Freetext Questions"], "free_text"),
        ...addTypeToQuestions(data["TrueFalse Questions"], "true_false"),
      ],
    };
  };

  const handleShowGradeAndAnswers = async (id, email) => {
    setShowGradeAndAnswers(true);
    setExamId(id);

    const handleShowStudentSubmission = async () => {
      const formData = new FormData();
      formData.append("email", email);
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/exam/${id}/submission/`,
          formData,
          { headers: getAuthHeaders() }
        );

        if (response.status === 200 || response.status === 201) {
          const transformedData = transformExamDetails(response.data);
          setStudentDetailsSubmission(response.data);
          setTransformedExamDetails(transformedData);
        } else {
          console.error("Failed to fetch student submission");
        }
      } catch (error) {
        console.error("Error fetching student submission:", error.message);
      }
    };

    await handleShowStudentSubmission();
  };

  const handleSumbitGrade = async (e) => {
    const fillGapsQuestions = Object.keys(grades)
      .filter((key) => key.startsWith("fill_gaps"))
      .map((key) => {
        const questionId = parseInt(key.split("-")[1]);
        return {
          id: questionId,
          grade: parseFloat(grades[key]).toFixed(1) || "0.0",
        };
      });

    const freetextQuestions = Object.keys(grades)
      .filter((key) => key.startsWith("free_text"))
      .map((key) => {
        const questionId = parseInt(key.split("-")[1]);
        return {
          id: questionId,
          grade: parseFloat(grades[key]).toFixed(1) || "0.0",
        };
      });

    const payload = {
      email: email,
      fillgaps_questions: fillGapsQuestions,
      freetext_questions: freetextQuestions,
      mcq_questions: [],
      truefalse_questions: [],
    };
    // console.log("payload:    ", payload);

    const authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    // Extract the access token
    const accessToken = authTokens ? authTokens.access : null;
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/exam/${examId}/submission/correct/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("Submit answers successfully!", response.data);
        window.location.href = `/groups/setting?group_id=${groupId}`;
      } else {
        console.error("Failed to submit answers");
      }
    } catch (error) {
      console.error("Error submitting answers:", error.message);
    }
  };

  const GradedMultipleChoice = (
    question_id,
    type,
    answersQuestion,
    pointsValue,
    selectedAnswers
  ) => {
    if (type === "multiple_choice") {
      if (Array.isArray(answersQuestion)) {
        const matchingValues = answersQuestion.filter((value) =>
          selectedAnswers.includes(value)
        );
        if (matchingValues.length < selectedAnswers.length) {
          return `Marks: ${matchingValues.length} / ${selectedAnswers.length}`;
        } else if (answersQuestion.length > selectedAnswers.length) {
          const matchingValuess = answersQuestion.filter((value) =>
            selectedAnswers.includes(value)
          );
          return `Marks: ${answersQuestion.length} / ${matchingValuess.length}`;
        } else if (matchingValues.length === selectedAnswers.length) {
          const matchingValuesss = answersQuestion.filter((value) =>
            selectedAnswers.includes(value)
          );
          return `Marks: ${matchingValuesss.length} / ${selectedAnswers.length}`;
        } else {
          return "No matching values";
        }
      } else {
        const valueInside = selectedAnswers.includes(answersQuestion);
        if (valueInside) {
          return `Marks: ${1} / ${selectedAnswers.length}`;
        } else {
          return `Marks: ${0} / ${selectedAnswers.length}`;
        }
      }
    } else if (type === "true_false") {
      if (selectedAnswers === answersQuestion.value) {
        return `Marks: ${pointsValue} / ${pointsValue}`;
      } else {
        return `Marks: ${0} / ${pointsValue}`;
      }
    }
  };

  const formatDateAndHour = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  const toggleDetails = (index) => {
    setShowDetailsArray((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleGradeChange = (questionId, type, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [`${type}-${questionId}`]: value,
    }));
  };
  // console.log(grades);
  // console.log("transformedExamDetails: ", transformedExamDetails);
  return (
    <>
      <Navbar />
      <div className="MainDivStudentPageGroup">
        {studentDetails.Student ? (
          <div className="MianPageStudentGroup">
            <div className="TextContnat">Member Information</div>
            <div className="MianPageStudentTestsGroup ">
              <div className="makePaddingGroup">
                <div className="firstColumnGroup">
                  <div className="NameOfInformationGroup">
                    <div className="NamedGroup">Username:</div>
                    <span className="theInformationGroup">
                      {studentDetails.Student.user.username}
                    </span>
                  </div>
                  <div className="NameOfInformationGroup">
                    <div className="NamedGroup">Email:</div>
                    <span className="theInformationGroup">
                      {studentDetails.Student.user.email}
                    </span>
                  </div>

                  <div className="NameOfInformationGroup">
                    <div className="NamedGroup">Registered:</div>
                    <span className="theInformationGroup">
                      {formatDateAndHour(
                        studentDetails.Student.user.date_joined
                      )}
                    </span>
                  </div>
                  <div className="NameOfInformationGroup">
                    <div className="NamedGroup">Last Login:</div>
                    <span className="theInformationGroup">
                      {formatDateAndHour(
                        studentDetails.Student.user.last_login
                      )}
                    </span>
                  </div>
                </div>
                <div className="secondColumnGroup">
                  <div className="LineVerticalGroup"></div>
                </div>
                <div className="ThirdColumn">
                  <label className="profileImageGroup">
                    <div type="file" id="fileInput" />
                    <img className="" src={PhotoUser} alt="" />
                  </label>
                </div>
              </div>
            </div>
            <div className={`MainDivContantGroup marginTopReviewGroup`}>
              <div className="addPadding">
                <div className="groupMembersRow">
                  <div className="groupMember">All Exams</div>
                </div>
                <div className="lineSepreteGroup marginTopGroup"></div>
                <div className="sectionAddMembersAssigned">
                  {studentDetails.Exams.length > 0 ? (
                    <>
                      {studentDetails.Exams.map((exam, index) => (
                        <div key={index}>
                          <div className="GroupMembersContant" key={exam.id}>
                            <div className="sectionExamNameHome">
                              <img
                                className="personIcon"
                                alt=""
                                src={personIcon}
                              ></img>
                              <div className="ExamNameDiv">{exam.name}</div>
                            </div>
                            <div className="twoButton">
                              <div
                                className="sectionButtonNewExam makeEdit "
                                onClick={() =>
                                  handleShowGradeAndAnswers(
                                    exam.id,
                                    studentDetails.Student.user.email
                                  )
                                }
                              >
                                Grade & Answers
                              </div>
                            </div>
                          </div>
                          <div className="lineSepreteExamDitalies"></div>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="loaderrr">
            <div className="loader"></div>
          </div>
        )}
      </div>
      {showGradeAndAnswers && (
        <div className="modal">
          <div className="modal-contentGradeAnswers">
            <span
              className="close2"
              onClick={() => setShowGradeAndAnswers(false)}
            >
              &times;
            </span>
            <div className="MainDivStudentPageGroup">
              <div className="MianPageStudentGroup">
                <div className="MyGroupsWordGroup">Grade</div>
                <div className="MianPageStudentTestsReview1Group ">
                  <div className="makePaddingGroup2">
                    <div className="firstColumnGroup">
                      <div className="NameOfInformationGroup">
                        <div className="NamedGroup">Percentage:</div>
                        <span className="theInformationGroup">100%</span>
                      </div>
                      <div className="NameOfInformationGroup">
                        <div className="NamedGroup">Marks:</div>
                        <span className="theInformationGroup">30/30</span>
                      </div>
                    </div>
                    <div className="secondColumnGroup">
                      <div className="LineVerticalGroup"></div>
                    </div>
                    <div className="firstColumnGroup">
                      <div className="NameOfInformationGroup">
                        <div className="NamedGroup">Grade:</div>
                        <span className="theInformationGroup">14/15</span>
                      </div>

                      <div className="NameOfInformationGroup">
                        <div className="NamedGroup">Duration:</div>
                        <span className="theInformationGroup">00:00:40</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="MyGroupsWordGroup topppp">Cheating cases</div>
                <div className="MianPageStudentTests toppp">
                  <div className="notExceedWidth">
                    {showLoader ? (
                      <div className="loaderrr">
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <table className="examsTable">
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>time cheating</th>
                            <th>time no person detected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetailsSubmission &&
                          studentDetailsSubmission["Cheating Cases"] &&
                          studentDetailsSubmission["Cheating Cases"].length >
                            0 ? (
                            studentDetailsSubmission["Cheating Cases"].map(
                              (cheat, index) => (
                                <tr key={index}>
                                  <td>{cheat.image}</td>
                                  <td>
                                    <div className="">
                                      {cheat.time_spent_cheating}s
                                    </div>
                                  </td>
                                  <td>
                                    <div className="">
                                      {cheat.time_no_person_present}
                                    </div>
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td colSpan="3">No cheating cases found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="MyGroupsWordGroup maginTopGroup">Answers</div>
                <div className="divAllQuestion">
                  {transformedExamDetails ? (
                    <>
                      {transformedExamDetails.questions.map(
                        (element, index) => (
                          <div className="MainDivContantReview" key={index}>
                            <div className="NumberAndQuationReview">
                              <div className="RowButtonsDisplayReview">
                                <div className="QuestionNumber">
                                  Question {index + 1} of{" "}
                                  {transformedExamDetails.questions.length}
                                </div>
                                <div className="charactersiticQuastionReview">
                                  {GradedMultipleChoice(
                                    element.question.id,
                                    element.type,
                                    element.answer,
                                    element.question.points,
                                    element.question.correct_answers
                                  )}
                                </div>
                              </div>
                              <div className="QuationContantReview">
                                {element.question.question}
                              </div>

                              <div className="sectionButtonsReview">
                                <div
                                  className="ButtonsDisplayReview"
                                  onClick={() => toggleDetails(index)}
                                >
                                  <div className="lineSepreteExamDitalies"></div>
                                  <img
                                    className="iconDeleteDisplayReview"
                                    src={Arrow_Down}
                                    alt=""
                                  />
                                  Answer
                                </div>
                              </div>
                              <div
                                className={`sectionApperorNotReview ${
                                  showDetailsArray[index]
                                    ? "openDetails"
                                    : "closeDetails"
                                }`}
                              >
                                {element.question.answer_options &&
                                  element.question.answer_options.length >
                                    0 && (
                                    <ul className="answerOptionalReview">
                                      <div className="lineSepreteExamDitaliesReview marginRightReview"></div>
                                      {element.question.answer_options.map(
                                        (choice, choiceindex) => (
                                          <div
                                            key={choiceindex}
                                            className={`Options ${
                                              element.question.correct_answers?.includes(
                                                choice
                                              ) &&
                                              element.answer?.includes(choice)
                                                ? "CorrectAnswer"
                                                : element.answer?.includes(
                                                    choice
                                                  ) &&
                                                  !element.question.correct_answers?.includes(
                                                    choice
                                                  )
                                                ? "WrongAnswer"
                                                : ""
                                            }`}
                                          >
                                            {String.fromCharCode(
                                              65 + choiceindex
                                            )}
                                            : {choice.replace(/<[^>]*>?/gm, "")}
                                          </div>
                                        )
                                      )}
                                    </ul>
                                  )}

                                <div>
                                  {element.type === "free_text" && (
                                    <div className="CorrectAnswerDisplayy">
                                      Put the grades:
                                      <input
                                        type="number"
                                        className="numberPointsInputtt"
                                        value={
                                          grades[
                                            `free_text-${element.question.id}`
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleGradeChange(
                                            element.question.id,
                                            "free_text",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <div> / {element.question.points}</div>
                                    </div>
                                  )}

                                  {element.type === "fill_gaps" && (
                                    <div className="CorrectAnswerDisplayy">
                                      Put the grades:
                                      <input
                                        className="numberPointsInputtt"
                                        type="number"
                                        value={
                                          grades[
                                            `fill_gaps-${element.question.id}`
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleGradeChange(
                                            element.question.id,
                                            "fill_gaps",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <div> / {element.question.points}</div>
                                    </div>
                                  )}
                                </div>

                                <div className="CorrectAnswerDisplay">
                                  {`student Answers: ${
                                    typeof element.answer === "string"
                                      ? element.answer.replace(/<[^>]*>?/gm, "")
                                      : element.answer
                                      ? String(element.answer).replace(
                                          /<[^>]*>?/gm,
                                          ""
                                        )
                                      : "No answer provided"
                                  }`}
                                </div>

                                {element.type !== "free_text" && (
                                  <div className="CorrectAnswerDisplay">
                                    {`The Correct Answers: ${
                                      element.question.correct_answers
                                        ? element.question.correct_answers
                                        : element.question.correct_answer
                                    }`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    "no answers found"
                  )}
                </div>
                <div className="divButton">
                  <button
                    className="ButtonSavetheAnswer"
                    onClick={handleSumbitGrade}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResultAndInformation;
