import "./App.css";
import ExamsPage from "./pages/mypagesInstructor/Exams/Exams";
// import Exam from "./studentExamDisplay/Exam"; 

import Login from "./signs/LoginPage/SignIn";
import SignUp from "./signs/LoginPage/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormatPdf from "./pages/mypagesInstructor/QuastionsPages/PDF_Format/formatpdf";
import SighninStudent from "./pages/pagesSigninStudent/signinPage";
import AcceptTerms from "./pages/pagesSigninStudent/AcceptTerms";
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


// import Exam from "./pages/studentExamDisplay/Exam"; 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Home/Login/1" element={<TypeLoginPage />} />
          <Route path="/Home/Login/2" element={<Login />} />
          <Route path="/Home/Login/3" element={<SignUp />} />

          <Route path="/Home" element={<HomePage />} />
          <Route path="/Exams" element={<ExamsPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Exams/ExamDetails" element={<ExamDetails />} />

          <Route path="/Home/AddPdfFormat" element={<FormatPdf />} />
          <Route path="/Home/SignInStudent/1" element={<SighninStudent />} />
          <Route path="/Home/SignInStudent/2" element={<AcceptTerms />} />

          <Route
            path="/Home/ExamName/AddQuaType"
            element={<ChoosesQuaType />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/MultipleChoice"
            element={<MultipleChoice />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/Trueandfalse"
            element={<TrueAndFalse />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/Essay"
            element={<EssayQuationPage />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/FreeText"
            element={<FreeText />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/FillGabs"
            element={<FillTheGabs />}
          />
          <Route
            path="/Home/ExamName/AddQuaType/ExamQuations"
            element={<AllExamQuation />}
          />
          <Route path="/Home/ExamName" element={<ExamName />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/setting" element={<GroupSetting />} />
          {/* <Route path="/studentExamDisplay" element={<Exam />} /> */}
          {/* /////////////////////////////////////////////////////////////////////// Students*/}
          <Route path="/student" element={<StudentPage />} />
          <Route path="/student/SpecificGroup" element={<SpecificGroup />} />
          <Route path="/student/SpecificGroup/Review" element={<Review />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
