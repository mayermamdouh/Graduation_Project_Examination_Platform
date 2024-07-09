import { useEffect, useState } from "react";
import NavBarStudent from "../NavbarStudent";

import Arrow_Down from "../../../Assets/iconDownArrow.png";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { getAuthHeaders } from "../../mypagesInstructor/component/file";

function Review() {
  const [transformedExamDetails, setTransformedExamDetails] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const exam_id = searchParams.get("exam_id");

  const [displayAnswers, setDisplayAnswers] = useState(true);

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
  const navigate = useNavigate();
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
      navigate("/userType");
    }
  }, []);
  const handleAnswers = () => {
    setDisplayAnswers(true);
  };
  // console.log("");
  const [showDetailsArray, setShowDetailsArray] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [answersQuestion, setAnswersQuestion] = useState([]);

  useEffect(() => {
    // Retrieve data from localStorage
    const localStorageData = localStorage.getItem("answersQuestion");

    // If there's data in localStorage, parse it and set the state
    if (localStorageData) {
      setAnswersQuestion(JSON.parse(localStorageData));
    }
  }, []); // Run only once on component mount

  const toggleDetails = (index) => {
    setshowDetails(!showDetails);
    setShowDetailsArray((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
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
  // testFunction();
  const getReviewData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/student/exam/${exam_id}/review/`,
        { headers: getAuthHeaders() }
      );
      if (response.status === 200 || response.status === 201) {
        // console.log("get the review data successfully: ", response.data);
        const transformedData = transformExamDetails(response.data);

        setTransformedExamDetails(transformedData);
      } else {
        console.log("Failed to review data");
      }
    } catch (error) {
      console.error("Error to review data:", error.message);
    }
  };

  useEffect(() => {
    getReviewData();
  }, []);
  // console.log("transformedExamDetails: ", transformedExamDetails);
  return (
    <>
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          <div className="MyGroupsWord">Review</div>
          <div className="MianPageStudentTestsReview1 ">
            <div className="makePadding">
              <div className="firstColumn">
                <div className="NameOfInformation">
                  <div className="Named"> Attempts Allowed:</div>
                  <span className="theInformation">1</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Percentage:</div>
                  <span className="theInformation">100%</span>
                </div>

                <div className="NameOfInformation">
                  <div className="Named"> Date Started:</div>
                  <span className="theInformation">Mon 22Apr 2024 20:30 </span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Date Finished:</div>
                  <span className="theInformation">Mon 22Apr 2024 22:30</span>
                </div>
              </div>
              <div className="secondColumn">
                <div className="LineVertical"></div>
              </div>
              <div className="firstColumn">
                <div className="NameOfInformation">
                  <div className="Named">Marks:</div>
                  <span className="theInformation">30/30</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Grade:</div>
                  <span className="theInformation">14/15</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Time Limit:</div>
                  <span className="theInformation">45</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Duration:</div>
                  <span className="theInformation">00:00:40</span>
                </div>
              </div>
            </div>
          </div>
          <div className="MyGroupsWordReview marginTopReview">
            <div
              className={`AllQuestion ${
                displayAnswers ? "selectedReview" : ""
              }`}
              onClick={handleAnswers}
            >
              Answers
            </div>
          </div>

          <div
            className={`MianPageStudentTestsReview2  ${
              displayAnswers ? "Appear" : "Hidden"
            }`}
          >
            <div className="divAllQuestion">
              {transformedExamDetails ? (
                <>
                  {transformedExamDetails.questions.map((element, index) => (
                    <div className="MainDivContantReview" key={index}>
                      <div className="NumberAndQuationReview">
                        <div className="RowButtonsDisplayReview">
                          <div className="QuestionNumber">
                            Question {index + 1} of{" "}
                            {transformedExamDetails.questions.length}
                          </div>
                          <div className="charactersiticQuastionReview">
                            {element.type === "multiple_choice" ||
                            element.type === "true_false" ? (
                              GradedMultipleChoice(
                                element.question.id,
                                element.type,
                                element.answer,
                                element.question.points,
                                element.question.correct_answers
                              )
                            ) : (
                              // Handling for free_text or fill_gaps
                              <div>
                                <p>
                                  Marks: {element.points} /{" "}
                                  {element.question.points}
                                </p>
                              </div>
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
                            element.question.answer_options.length > 0 && (
                              <ul className="answerOptionalReview">
                                <div className="lineSepreteExamDitaliesReview marginRightReview"></div>
                                {element.question.answer_options.map(
                                  (choice, choiceindex) => (
                                    <div
                                      key={choiceindex}
                                      className={`Options ${
                                        element.question.correct_answers?.includes(
                                          choice
                                        ) && element.answer?.includes(choice)
                                          ? "CorrectAnswer"
                                          : element.answer?.includes(choice) &&
                                            !element.question.correct_answers?.includes(
                                              choice
                                            )
                                          ? "WrongAnswer"
                                          : ""
                                      }`}
                                    >
                                      {String.fromCharCode(65 + choiceindex)}:{" "}
                                      {choice.replace(/<[^>]*>?/gm, "")}
                                    </div>
                                  )
                                )}
                              </ul>
                            )}

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
                  ))}
                </>
              ) : (
                "no answers found"
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Review;
