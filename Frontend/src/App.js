import "./App.css";
import HomePage from "./pages/mypages/Home";
// import AddQuaManuall from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddQuaManuall";

import Login from "./signs/LoginPage/SignIn";
import SignUp from "./signs/LoginPage/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormatPdf from "./pages/mypages/QuastionsPages/PDF_Format/formatpdf";
import SighninStudent from "./pages/pagesSigninStudent/signinPage";
import AcceptTerms from "./pages/pagesSigninStudent/AcceptTerms";
import TypeLoginPage from "./signs/TypeuserSignin/chooseType";
import ChoosesQuaType from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/ChooseQuaType";
import MultipleChoice from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/MultipleChoiceType";
import TrueAndFalse from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/TrueAndFalse";
import EssayQuationPage from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/EssayQuastionPage";
import FreeText from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/FreeTextQuastion";
import FillTheGabs from "./pages/mypages/QuastionsPages/AddQuastionsFolder/AddTypeOfQuastion/Types/FillTheGaps";
import AllExamQuation from "./pages/mypages/ExamsDisplayed/ExamQuationDisplay";
import ExamSettings from "./pages/mypages/ExamSettings/ExamSettings";
import ExamDetails from "./pages/mypages/ExamDetails/ExamDetails";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Home/Login/2" element={<Login />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Home/ExamDetails" element={<ExamDetails />} />
          {/* <Route path="/Home/AddQuamanuall" element={<AddQuaManuall />} /> */}
          <Route path="/Home/AddPdfFormat" element={<FormatPdf />} />
          <Route path="/Home/SignInStudent/1" element={<SighninStudent />} />
          <Route path="/Home/SignInStudent/2" element={<AcceptTerms />} />
          <Route path="/Home/Login/1" element={<TypeLoginPage />} />
          <Route path="/Home/Login/3" element={<SignUp />} />
          <Route
            path="/Home/ExamSettings/AddQuaType"
            element={<ChoosesQuaType />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/MultipleChoice"
            element={<MultipleChoice />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/Trueandfalse"
            element={<TrueAndFalse />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/Essay"
            element={<EssayQuationPage />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/FreeText"
            element={<FreeText />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/FillGabs"
            element={<FillTheGabs />}
          />
          <Route
            path="/Home/ExamSettings/AddQuaType/ExamQuations"
            element={<AllExamQuation />}
          />
          <Route path="/Home/ExamSettings" element={<ExamSettings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
