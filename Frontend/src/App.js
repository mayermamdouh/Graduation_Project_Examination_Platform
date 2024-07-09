import "./App.css";
import ExamsPage from "./pages/mypagesInstructor/Exams/Exams";
import Login from "./signs/LoginPage/SignIn";
import SignUp from "./signs/LoginPage/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TypeLoginPage from "./signs/TypeuserSignin/chooseType";
import ChoosesQuaType from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/ChooseQuaType";
import MultipleChoice from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/MultipleChoiceType";
import TrueAndFalse from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/TrueAndFalse";
import EssayQuationPage from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/EssayQuastionPage";
import FreeText from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/FreeTextQuastion";
import FillTheGabs from "./pages/mypagesInstructor/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/FillTheGaps";
import AllExamQuation from "./pages/mypagesInstructor/ExamsDisplayed/ExamQuationDisplay";
import ExamName from "./pages/mypagesInstructor/ExamName/ExamName";
import ExamDetails from "./pages/mypagesInstructor/ExamDetails/ExamDetails";
import HomePage from "./pages/mypagesInstructor/HomePage/Home";
import ProfilePage from "./pages/mypagesInstructor/Profile/Profile";
import Groups from "./pages/mypagesInstructor/Groups/group";
import GroupSetting from "./pages/mypagesInstructor/Groups/groupSetting";
import StudentPage from "./pages/StudentPages/studentGroups/studentGroups";
import SpecificGroup from "./pages/StudentPages/specificGroups/specificGroup";
import Review from "./pages/StudentPages/ReviewResultExam/Review";
import ResultAndInformation from "./pages/mypagesInstructor/Groups/ResultUesrInGroup";
import TakeExam from "./pages/StudentPages/TakeExam/takeExam";
// import WebcamComponent from "./pages/StudentPages/testaimodel";
// import { updateToken } from "./pages/mypagesInstructor/component/file";
import { AuthWrapper } from "./pages/mypagesInstructor/component/file";
// import { useEffect } from "react";

// Configure axios to send cookies with each request

const App = () => {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/userType" element={<TypeLoginPage />} />
          <Route path="/userType/SignIn" element={<Login />} />
          <Route path="/userType/SignUp" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Exams" element={<ExamsPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Exams/ExamDetails" element={<ExamDetails />} />
   
          <Route path="/ExamName/AddQuaType" element={<ChoosesQuaType />} />
          <Route
            path="/ExamName/AddQuaType/MultipleChoice"
            element={<MultipleChoice />}
          />
          <Route
            path="/ExamName/AddQuaType/Trueandfalse"
            element={<TrueAndFalse />}
          />
          <Route
            path="/ExamName/AddQuaType/Essay"
            element={<EssayQuationPage />}
          />
          <Route path="/ExamName/AddQuaType/FreeText" element={<FreeText />} />
          <Route
            path="/ExamName/AddQuaType/FillGabs"
            element={<FillTheGabs />}
          />
          <Route
            path="/ExamName/AddQuaType/ExamQuations"
            element={<AllExamQuation />}
          />
          <Route path="/ExamName" element={<ExamName />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/setting" element={<GroupSetting />} />
          <Route
            path="/groups/setting/user"
            element={<ResultAndInformation />}
          />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/student/SpecificGroup" element={<SpecificGroup />} />
          <Route path="/student/SpecificGroup/Review" element={<Review />} />
          <Route path="/student/SpecificGroup/exam" element={<TakeExam />} />
         
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default App;