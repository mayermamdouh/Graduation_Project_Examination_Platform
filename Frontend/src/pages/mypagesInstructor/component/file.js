import { useLocation } from "react-router";

export function StepIndicator() {
  const location = useLocation();

  // Define a function to determine if a step is active based on the path
  const isStepActive = (stepPath) => {
    return location.pathname.startsWith(stepPath);
  };

  return (
    <div className="step-indicator">
      <div
        className={`step ${isStepActive("/Home/ExamSettings") ? "active" : ""}`}
      >
        1
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType") ? "active" : ""
        }`}
      >
        2
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType/MultipleChoice") ||
          isStepActive("/Home/ExamSettings/AddQuaType/Trueandfalse") ||
          isStepActive("/Home/ExamSettings/AddQuaType/Essay") ||
          isStepActive("/Home/ExamSettings/AddQuaType/FreeText") ||
          isStepActive("/Home/ExamSettings/AddQuaType/FillGabs") ||
          isStepActive("/Home/ExamSettings/AddQuaType/ExamQuations")
            ? "active"
            : ""
        }`}
      >
        3
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/Home/ExamSettings/AddQuaType/ExamQuations")
            ? "active"
            : ""
        }`}
      >
        4
      </div>
    </div>
  );
}
