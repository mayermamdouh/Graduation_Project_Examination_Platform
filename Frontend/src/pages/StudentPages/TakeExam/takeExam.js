import "./takeExam.css";
import flagicon from "../../../Assets/flagicon.png";
import rightarrow from "../../../Assets/rightarrow.png";
import leftarrow from "../../../Assets/leftarrow.png";
import stopwatch from "../../../Assets/stopwatch.png";
import React, { useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import { Camera } from "@mediapipe/camera_utils";
import {
  dot,
  norm,
  round,
  multiply,
  subtract,
  mean,
  acos,
  pi,
  divide,
  max,
} from "mathjs";
const { FaceLandmarker, FilesetResolver } = vision;
function Takeexam() {
  const navigate = useNavigate();
  const location = useLocation();

  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  useEffect(() => {
    if (!authTokens) {
      navigate("/userType");
    }
  }, []);
  const [examDetails, setExamDetails] = useState(null);
  // console.log("examDetails: ", examDetails);
  // Manage time
  const [initialTime, setInitialTime] = useState(0);
  const [timeInSeconds, setTimeInSeconds] = useState(() => {
    const savedTime = localStorage.getItem("timeInSeconds");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const encodedExamDetails = searchParams.get("exam_details");

    if (encodedExamDetails) {
      try {
        const decodedExamDetails = JSON.parse(
          decodeURIComponent(encodedExamDetails)
        );
        const addTypeToQuestions = (questions, type) => {
          return (questions || []).map((question) => ({
            ...question,
            type,
          }));
        };

        const transformedExamDetails = {
          ...decodedExamDetails.exam_details,
          questions: [
            ...addTypeToQuestions(
              decodedExamDetails.mcq_questions,
              "multiple_choice"
            ),
            ...addTypeToQuestions(
              decodedExamDetails.fill_gaps_questions,
              "fill_gaps"
            ),
            ...addTypeToQuestions(
              decodedExamDetails.free_text_questions,
              "free_text"
            ),
            ...addTypeToQuestions(
              decodedExamDetails.true_false_questions,
              "true_false"
            ),
          ],
        };

        setExamDetails(transformedExamDetails);
        const examDurationInSeconds =
          transformedExamDetails.duration_minutes * 60;
        if (timeInSeconds === 0) {
          setInitialTime(examDurationInSeconds);
          setTimeInSeconds(examDurationInSeconds);
        }
      } catch (error) {
        console.error("Failed to decode exam details:", error);
      }
    }
  }, []);
  // console.log("examDetails: ", examDetails);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInSeconds((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          localStorage.setItem("timeInSeconds", 0);
          return 0;
        }
        localStorage.setItem("timeInSeconds", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  useEffect(() => {
    localStorage.setItem("timeInSeconds", timeInSeconds);
  }, [timeInSeconds]);

  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  const [leaveCount, setLeaveCount] = useState(() => {
    const savedCount = localStorage.getItem("leaveCount");
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    let isReloading = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isReloading) {
        setLeaveCount((prevCount) => {
          const newCount = prevCount + 1;
          localStorage.setItem("leaveCount", newCount);
          return newCount;
        });
      }
    };

    const handleBeforeUnload = () => {
      isReloading = true;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [answersQuestion, setAnswersQuestion] = useState(() => {
    const savedAnswers = localStorage.getItem("answersQuestion");
    return savedAnswers !== null ? JSON.parse(savedAnswers) : {};
  });
  // console.log("answersQuestion: ", answersQuestion);

  const updateAnswers = (questionId, questionType, answer) => {
    const newAnswers = { ...answersQuestion };
    const key = `${questionId}_${questionType}`;
    newAnswers[key] = { id: questionId, type: questionType, answer };
    setAnswersQuestion(newAnswers);
    localStorage.setItem("answersQuestion", JSON.stringify(newAnswers));
  };

  const handleCheckboxChange = (e, questionId) => {
    const newCheckboxAnswers = { ...answersQuestion };
    const key = `${questionId}_multiple_choice`;
    if (!newCheckboxAnswers[key]) {
      newCheckboxAnswers[key] = {
        id: questionId,
        type: "multiple_choice",
        answer: [],
      };
    }

    const checkedValues = new Set(newCheckboxAnswers[key].answer);

    if (e.target.checked) {
      checkedValues.add(e.target.value);
    } else {
      checkedValues.delete(e.target.value);
    }

    newCheckboxAnswers[key].answer = Array.from(checkedValues);
    setAnswersQuestion(newCheckboxAnswers);
    localStorage.setItem("answersQuestion", JSON.stringify(newCheckboxAnswers));
  };

  const handleRadioChange = (e, questionId) => {
    updateAnswers(questionId, "multiple_choice", e.target.value);
  };

  const handleFillGapsChange = (e, questionId, answerIndex) => {
    const newFillGapsAnswers = { ...answersQuestion };
    const key = `${questionId}_fill_gaps`;
    if (!newFillGapsAnswers[key]) {
      newFillGapsAnswers[key] = {
        id: questionId,
        type: "fill_gaps",
        answer: [],
      };
    }
    newFillGapsAnswers[key].answer[answerIndex] = e.target.value;

    setAnswersQuestion(newFillGapsAnswers);
    localStorage.setItem("answersQuestion", JSON.stringify(newFillGapsAnswers));
  };

  const handleTrueFalseChange = (e, questionId) => {
    updateAnswers(questionId, "true_false", e.target.value);
  };

  const handleEssayQuestion = (content, questionId) => {
    updateAnswers(questionId, "free_text", content);
  };

  const isAnswered = (questionId, questionType) => {
    const key = `${questionId}_${questionType}`;
    const answer = answersQuestion[key]?.answer;
    if (answer) {
      if (Array.isArray(answer)) {
        return answer.some((ans) => ans && ans.trim() !== "");
      }
      return answer && answer.trim() !== "" && answer !== "<p><br></p>";
    }
    return false;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem("selectedQuestionIndex");
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });
  const isFirstQuestion = selectedQuestionIndex === 0;
  const isLastQuestion =
    selectedQuestionIndex === examDetails?.questions?.length - 1;
  const handleQuestionClick = (index) => {
    setSelectedQuestionIndex(index);
    localStorage.setItem("selectedQuestionIndex", index);
    // console.log("answersQuestion: ", answersQuestion);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const [flagQuestion, setFlagQuestion] = useState(() => {
    const savedFlags = localStorage.getItem("flagQuestion");
    return savedFlags !== null ? JSON.parse(savedFlags) : [];
  });

  const toggleFlagQuestion = (index) => {
    setFlagQuestion((prevFlagQuestion) => {
      const updatedFlagQuestion = prevFlagQuestion.includes(index)
        ? prevFlagQuestion.filter((i) => i !== index)
        : [...prevFlagQuestion, index];
      localStorage.setItem("flagQuestion", JSON.stringify(updatedFlagQuestion));
      return updatedFlagQuestion;
    });
  };

  const [showFinishExam, setShowFinishExam] = useState(false);

  const handleCancelDelete = () => {
    setShowFinishExam(false);
  };
  // console.log("",examDetails);
  const attemptSubmit = async () => {
    const formattedAnswers = {
      new_tab: leaveCount,
      questions: Object.values(answersQuestion).map(({ id, type, answer }) => ({
        question_type: type === "multiple_choice" ? "mcq" : type,
        answer,
        id,
      })),
    };
    // console.log("formattedAnswers: ", formattedAnswers);
    // console.log(examDetails.id);
    const authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    // Extract the access token
    const accessToken = authTokens ? authTokens.access : null;
    // console.log("tokens: ", accessToken);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/student/exam/${examDetails.id}/submit/`,
        formattedAnswers,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("Exam submitted successfully:", response.data);
        localStorage.removeItem("timeInSeconds");
        localStorage.removeItem("leaveCount");
        localStorage.removeItem("flagQuestion");
        localStorage.removeItem("selectedQuestionIndex");
        localStorage.removeItem("answersQuestion");

        navigate("/student");
      } else {
        console.log("Failed to submit exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error.message);
    }
  };

  const checkAndSubmit = async () => {
    if (navigator.onLine) {
      await attemptSubmit();
    } else {
      console.log("Currently offline, will retry in 5 seconds...");
      setTimeout(checkAndSubmit, 5000);
    }
  };
  ////////////////////////////////////////////////////////////// Ai part
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [personDetected, setPersonDetected] = useState(false);

  const [cheatingCount, setCheatingCount] = useState(0);
  const [noPersonDuration, setNoPersonDuration] = useState(0);
  const previousCheatingState = useRef(false);
  const noPersonStartTimeRef = useRef(null);
  const cheatingStartTimeRef = useRef(null);
  const cheatingPhotoData = useRef(null);
  const NoPersonPhotoData = useRef(null);
  const [cheatingList, setCheatingList] = useState([]);
  const [individualCheatingDurations, setIndividualCheatingDurations] =
    useState([]);
  const [individualNoPersonDurations, setIndividualNoPersonDurations] =
    useState([]);

  const threshold = 40;
  const average = 0.9;
  const period = 30;
  const EAR_THRESHOLD = 0.2; // Threshold for eye closure detection

  function innerAngle(point1, point2, point3) {
    const a = [...point1];
    const b = [...point2];
    const c = [...point3];
    const ba = subtract(a, b);
    const bc = subtract(c, b);
    const cosineAngle = divide(dot(ba, bc), multiply(norm(ba), norm(bc)));
    const angle = acos(cosineAngle);

    return (angle * 180) / pi;
  }

  function computeEAR(eye) {
    const A = norm(subtract(eye[1], eye[5]));
    const B = norm(subtract(eye[2], eye[4]));
    const C = norm(subtract(eye[0], eye[3]));
    const ear = (A + B) / (2.0 * C);
    return ear;
  }

  useEffect(() => {
    const createFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "IMAGE",
            numFaces: 1,
          }
        );
        setFaceLandmarker(landmarker);
      } catch (error) {
        console.error("Error initializing FaceLandmarker:", error);
      }
    };

    createFaceLandmarker();
  }, []);

  const noPersonDetected = () => {
    if (!noPersonStartTimeRef.current) {
      noPersonStartTimeRef.current = new Date();
      setTimeout(() => {
        const snapshot = takeSnapshot();
        NoPersonPhotoData.current = snapshot;
      }, 1000); //
    }
  };

  const personReturned = () => {
    if (noPersonStartTimeRef.current) {
      const endTime = new Date();
      const duration = (endTime - noPersonStartTimeRef.current) / 1000;
      setNoPersonDuration((prevTime) => prevTime + duration);
      setIndividualNoPersonDurations((prevList) => [...prevList, duration]);
      sendCheatingData(NoPersonPhotoData.current, 0, duration);
      noPersonStartTimeRef.current = null;
    }
  };

  const onResults = (results) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      setPersonDetected(true);
      personReturned();

      if (noPersonStartTimeRef.current) {
        const endTime = new Date();
        const duration = (endTime - noPersonStartTimeRef.current) / 1000;
        setNoPersonDuration((prevTime) => prevTime + duration);
        setIndividualNoPersonDurations((prevList) => [...prevList, duration]);
        noPersonStartTimeRef.current = null;
        const snapshot = takeSnapshot();
        NoPersonPhotoData.current = snapshot;
        sendCheatingData(cheatingPhotoData.current, 0, duration);
      }

      const img_h = canvasElement.height;
      const img_w = canvasElement.width;

      const mesh_points = results.faceLandmarks[0].map((p) => [
        round(multiply(p.x, img_w)),
        round(multiply(p.y, img_h)),
      ]);

      const LEFT_IRIS = [474, 475, 476, 477];
      const RIGHT_IRIS = [469, 470, 471, 472];
      const LEFT_EYE = [33, 160, 158, 133, 153, 144];
      const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

      const leftEAR = computeEAR(LEFT_EYE.map((index) => mesh_points[index]));
      const rightEAR = computeEAR(RIGHT_EYE.map((index) => mesh_points[index]));
      const avgEAR = (leftEAR + rightEAR) / 2.0;

      if (avgEAR < EAR_THRESHOLD) {
        canvasCtx.restore();
        return; // Skip this frame if eyes are closed
      }

      const l_cx = mean(LEFT_IRIS.map((index) => mesh_points[index][0]));
      const l_cy = mean(LEFT_IRIS.map((index) => mesh_points[index][1]));
      const r_cx = mean(RIGHT_IRIS.map((index) => mesh_points[index][0]));
      const r_cy = mean(RIGHT_IRIS.map((index) => mesh_points[index][1]));

      const middle_left_iris = mesh_points[159];
      const middle_right_iris = mesh_points[386];

      const center_left = [r_cx, r_cy];
      const center_right = [l_cx, l_cy];

      const angle_left_iris = [middle_left_iris[0], center_left[1]];
      const angle_right_iris = [middle_right_iris[0], center_right[1]];

      const angle_left = innerAngle(
        center_left,
        middle_left_iris,
        angle_left_iris
      );
      const angle_right = innerAngle(
        center_right,
        middle_right_iris,
        angle_right_iris
      );

      const distance = max(angle_left, angle_right);

      if (cheatingList.length < period) {
        cheatingList.push(distance >= threshold ? 1 : 0);
      } else {
        cheatingList.shift();
        cheatingList.push(distance >= threshold ? 1 : 0);
      }

      const isCheating =
        cheatingList.length === period && mean(cheatingList) >= average;

      if (isCheating && !previousCheatingState.current) {
        setCheatingCount((prevCount) => prevCount + 1);
        previousCheatingState.current = true;
        cheatingStartTimeRef.current = new Date();
        const snapshot = takeSnapshot();
        cheatingPhotoData.current = snapshot;
        // console.log("is cheating");
      } else if (!isCheating && previousCheatingState.current) {
        const endTime = new Date();
        const duration = (endTime - cheatingStartTimeRef.current) / 1000;
        setIndividualCheatingDurations((prevList) => [...prevList, duration]);
        previousCheatingState.current = false;
        sendCheatingData(cheatingPhotoData.current, duration, 0);
        cheatingPhotoData.current = null;
      }

      previousCheatingState.current = isCheating;
    } else {
      setPersonDetected(false);
      noPersonDetected();

      if (!noPersonStartTimeRef.current) {
        noPersonStartTimeRef.current = new Date();
      }

      previousCheatingState.current = false;
      cheatingList.length = 0; // Clear the cheating list
    }
  };

  useEffect(() => {
    if (faceLandmarker && runningMode === "VIDEO") {
      const videoElement = videoRef.current;

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (faceLandmarker) {
            const results = await faceLandmarker.detectForVideo(
              videoElement,
              performance.now()
            );
            onResults(results);
          }
        },
        width: 1280,
        height: 720,
      });

      const enableCam = async () => {
        if (!faceLandmarker) {
          console.log("Wait! faceLandmarker not loaded yet.");
          return;
        }

        await faceLandmarker.setOptions({ runningMode: "VIDEO" });
        setWebcamRunning(true);
        camera.start();
      };

      enableCam();
    }
  }, [faceLandmarker, runningMode]);

  useEffect(() => {
    if (faceLandmarker) {
      enableCam(); // Automatically enable the camera when the component mounts
    }
  }, [faceLandmarker]);

  const enableCam = async () => {
    if (!faceLandmarker) {
      console.log("Wait! faceLandmarker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
    } else {
      await faceLandmarker.setOptions({ runningMode: "VIDEO" });
      setWebcamRunning(true);

      const videoElement = videoRef.current;

      const constraints = {
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {
        videoElement.srcObject = stream;
        videoElement.addEventListener("loadeddata", async () => {
          setRunningMode("VIDEO");
          await faceLandmarker.setOptions({ runningMode: "VIDEO" });
          predictWebcam();
        });
      });
    }
  };

  const predictWebcam = async () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    const ratio = videoElement.videoHeight / videoElement.videoWidth;
    const videoWidth = 280;
    const borderRadiusValue = "10px"; // Adjust the border-radius value as needed

    videoElement.style.width = videoWidth + "px";
    videoElement.style.height = videoWidth * ratio + "px";
    videoElement.style.borderRadius = borderRadiusValue; // Add border-radius to video

    canvasElement.style.width = videoWidth + "px";
    canvasElement.style.height = videoWidth * ratio + "px";
    canvasElement.style.borderRadius = borderRadiusValue; // Add border-radius to canvas

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    if (webcamRunning) {
      if (faceLandmarker) {
        const results = await faceLandmarker.detectForVideo(
          videoElement,
          performance.now()
        );
        onResults(results);
      }
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const takeSnapshot = () => {
    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;

    // Ensure video is ready
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      const context = canvasElement.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Log to verify the snapshot
      // console.log("Snapshot taken");
      // console.log(
      //   "Canvas dimensions:",
      //   canvasElement.width,
      //   canvasElement.height
      // );
      // console.log(
      //   "Video dimensions:",
      //   videoElement.videoWidth,
      //   videoElement.videoHeight
      // );

      const imageData = context.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      // console.log("Image data:", imageData);

      // Extract image data for further inspection
      const dataURL = canvasElement.toDataURL("image/jpeg");
      // console.log("Data URL:", dataURL);
      return dataURL;
    } else {
      console.error("Video element not ready");
      return null;
    }
  };

  const sendCheatingData = async (
    photoData,
    cheatingDuration,
    noPersonDuration
  ) => {
    if (!photoData) {
      console.error("No photo data to send");
      return;
    }

    // Convert base64 to Blob
    const byteString = atob(photoData.split(",")[1]);
    const mimeString = photoData.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append("image", blob, "photo.jpg");
    formData.append("time_spent_cheating", cheatingDuration);
    formData.append("time_no_person_present", noPersonDuration);

    // Log formData to verify it
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    const authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    // Extract the access token
    const accessToken = authTokens ? authTokens.access : null;
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/student/exam/${examDetails.id}/cheating-case/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("Cheating data sent successfully");
      } else {
        console.error("Error sending cheating data");
      }
    } catch (error) {
      console.error("Error sending cheating data:", error);
    }
  };

  ////////////////////////////////////////////////////////////// Ai part

  return (
    <>
      {examDetails ? (
        <>
          <div className="MainDivPage">
            <div
              className="container"
              // style={{ position: "relative", width: "250px", height: "250px" }}
            >
              <video
                ref={videoRef}
                className="input_video"
                autoPlay
                style={{ display: "block", width: "100%", height: "100%" }}
              ></video>
              <canvas
                ref={canvasRef}
                className="output_canvas"
                width="280px"
                height="280px"
                style={{ position: "absolute", left: 0, top: 0 }}
              ></canvas>
            </div>
            <div className="MainPageExam">
              {leaveCount >= 1 ? (
                <div className="WarningStudent">
                  This is a warning you have left and returned to this exam{" "}
                  {leaveCount} times.
                </div>
              ) : (
                ""
              )}
              <div className="Timer">
                <img className="timeicon" src={stopwatch} alt="stopwatch" />
                <div className="time">
                  {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </div>
              </div>
              <div className="firstRow">
                <div className="boxData">
                  <div>Question {selectedQuestionIndex + 1}</div>
                  <div className="marks">
                    {examDetails && (
                      <div className="marks">
                        Marks:{" "}
                        {examDetails?.questions[selectedQuestionIndex]?.points}
                      </div>
                    )}
                  </div>
                  <div className="flagrow">
                    <img className="flag" src={flagicon} alt=""></img>
                    <div
                      onClick={() => toggleFlagQuestion(selectedQuestionIndex)}
                    >
                      {flagQuestion.includes(selectedQuestionIndex)
                        ? "Remove Flag"
                        : "Flag question"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="QuestionContent">
                {examDetails?.questions?.map((element, index) => (
                  <div key={index} className="questionDetails">
                    {selectedQuestionIndex === index && (
                      <>
                        <div className="questionContent">
                          {element.question}
                        </div>
                        {element.type === "multiple_choice" ? (
                          <div className="answersMultiple">
                            {element?.answer_options?.map(
                              (answer, answerIndex) => (
                                <div key={answerIndex} className="answerOption">
                                  {element.multiple_answers ? (
                                    <div className="checkboxOption">
                                      <input
                                        type="checkbox"
                                        id={`answer_${element.id}_${answerIndex}`}
                                        name={`question_${element.id}`}
                                        className="checkbox"
                                        value={answer}
                                        checked={
                                          Array.isArray(
                                            answersQuestion[
                                              `${element.id}_multiple_choice`
                                            ]?.answer
                                          ) &&
                                          answersQuestion[
                                            `${element.id}_multiple_choice`
                                          ]?.answer?.includes(answer)
                                        }
                                        onChange={(e) =>
                                          handleCheckboxChange(e, element.id)
                                        }
                                      />
                                      <label
                                        className="answercontent"
                                        htmlFor={`answer_${element.id}_${answerIndex}`}
                                      >
                                        {String.fromCharCode(97 + answerIndex)}.{" "}
                                        {answer}
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="radioOption">
                                      <input
                                        type="radio"
                                        id={`answer_${element.id}_${answerIndex}`}
                                        name={`question_${element.id}`}
                                        className="radio"
                                        value={answer}
                                        checked={
                                          answersQuestion[
                                            `${element.id}_multiple_choice`
                                          ]?.answer === answer
                                        }
                                        onChange={(e) =>
                                          handleRadioChange(e, element.id)
                                        }
                                      />
                                      <label
                                        className="answercontent"
                                        htmlFor={`answer_${element.id}_${answerIndex}`}
                                      >
                                        {String.fromCharCode(97 + answerIndex)}.{" "}
                                        {answer}
                                      </label>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : element.type === "fill_gaps" ? (
                          <div key={index} className="FillTheGapsSection">
                            {(() => {
                              const placeholders =
                                element.question.match(/\.{5}/g) || [];
                              return placeholders?.map((_, answerIndex) => (
                                <div key={answerIndex}>
                                  <input
                                    className="inputFillGaps"
                                    placeholder={`Answer ${answerIndex + 1}`}
                                    value={
                                      answersQuestion[`${element.id}_fill_gaps`]
                                        ?.answer[answerIndex] || ""
                                    }
                                    onChange={(e) =>
                                      handleFillGapsChange(
                                        e,
                                        element.id,
                                        answerIndex
                                      )
                                    }
                                  />
                                </div>
                              ));
                            })()}
                          </div>
                        ) : element.type === "free_text" ? (
                          <div className="textArea">
                            <ReactQuill
                              value={
                                answersQuestion[`${element.id}_free_text`]
                                  ?.answer || ""
                              }
                              onChange={(content) =>
                                handleEssayQuestion(content, element.id)
                              }
                            />
                          </div>
                        ) : element.type === "true_false" ? (
                          <div key={index} className="TrueFalseSection">
                            <div className="textalign">
                              <input
                                type="radio"
                                id={`answer_${element.id}_true`}
                                name={`question_${element.id}`}
                                value="True"
                                className="radio"
                                checked={
                                  answersQuestion[`${element.id}_true_false`]
                                    ?.answer === "True"
                                }
                                onChange={(e) =>
                                  handleTrueFalseChange(e, element.id)
                                }
                              />
                              <label
                                htmlFor={`answer_${element.id}_true`}
                                className="valueTrueFalse"
                              >
                                True
                              </label>
                            </div>
                            <div className="textalign">
                              <input
                                type="radio"
                                id={`answer_${element.id}_false`}
                                name={`question_${element.id}`}
                                value="False"
                                className="radio"
                                checked={
                                  answersQuestion[`${element.id}_true_false`]
                                    ?.answer === "False"
                                }
                                onChange={(e) =>
                                  handleTrueFalseChange(e, element.id)
                                }
                              />
                              <label
                                htmlFor={`answer_${element.id}_false`}
                                className="valueTrueFalse"
                              >
                                False
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="ButtonsBackNext">
                {!isFirstQuestion && (
                  <button
                    className="buttonBack"
                    onClick={() =>
                      handleQuestionClick(selectedQuestionIndex - 1)
                    }
                  >
                    Back
                  </button>
                )}
                {!isLastQuestion && (
                  <button
                    className="buttonBack"
                    onClick={() =>
                      handleQuestionClick(selectedQuestionIndex + 1)
                    }
                  >
                    Next
                  </button>
                )}
              </div>

              <div className={`drawer-container ${isOpen ? "open" : ""}`}>
                <button className="toggle-button" onClick={toggleDrawer}>
                  <img
                    src={isOpen ? rightarrow : leftarrow}
                    alt=""
                    className="arrows"
                  ></img>
                </button>
                <div className="drawer-content">
                  <div className="Questions">Questions</div>
                  <div className="linedrawer"></div>
                  <div className="numberOfQuestion">
                    {examDetails?.questions?.map((element, index) => (
                      <div
                        key={index}
                        className={`questioncontent ${
                          selectedQuestionIndex === index ? "activeDrawer" : ""
                        } ${
                          flagQuestion.includes(index)
                            ? "activeFlag"
                            : isAnswered(element.id, element.type)
                            ? "Answered"
                            : ""
                        }`}
                        onClick={() => handleQuestionClick(index)}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="buttondiv">
                    <button
                      className="buttonFinishAttempt"
                      onClick={() => setShowFinishExam(true)}
                    >
                      Finish Attempt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showFinishExam && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={handleCancelDelete}>
                  &times;
                </span>

                {examDetails?.questions?.map((element, index) => (
                  <div key={index} onClick={() => handleQuestionClick(index)}>
                    {isAnswered(element.id, element.type) ? (
                      ""
                    ) : (
                      <>
                        <div className="questionCss">
                          Question:{" "}
                          <div className="indexNotAnswered">{index + 1}</div>{" "}
                          not answered yet
                        </div>
                        <div className="lineSeprate"></div>
                      </>
                    )}
                  </div>
                ))}
                <p>Are you sure you want to submit the exam?</p>
                <div className="button-container-Exams">
                  <button onClick={checkAndSubmit}>Yes</button>
                  {/* onClick={handleFinishExamButton} */}
                  <button onClick={handleCancelDelete}>No</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Takeexam;
