import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export function StepIndicator() {
  const location = useLocation();

  // Define a function to determine if a step is active based on the path
  const isStepActive = (stepPath) => {
    return location.pathname.startsWith(stepPath);
  };

  return (
    <div className="step-indicator">
      <div className={`step ${isStepActive("/ExamSettings") ? "active" : ""}`}>
        1
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/ExamSettings/AddQuaType") ? "active" : ""
        }`}
      >
        2
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/ExamSettings/AddQuaType/MultipleChoice") ||
          isStepActive("/ExamSettings/AddQuaType/Trueandfalse") ||
          isStepActive("/ExamSettings/AddQuaType/Essay") ||
          isStepActive("/ExamSettings/AddQuaType/FreeText") ||
          isStepActive("/ExamSettings/AddQuaType/FillGabs") ||
          isStepActive("/ExamSettings/AddQuaType/ExamQuations")
            ? "active"
            : ""
        }`}
      >
        3
      </div>
      <div className="line"></div>
      <div
        className={`step ${
          isStepActive("/ExamSettings/AddQuaType/ExamQuations") ? "active" : ""
        }`}
      >
        4
      </div>
    </div>
  );
}

export const handleSignOut = async (e) => {
  // Uncomment if needed to prevent default form submission behavior
  // e.preventDefault();

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/auth/signout/`,
      {}
      // { headers: getAuthHeaders() }
    );

    if (response.status === 200 || response.status === 201) {
      // console.log("Sign out successful:", response.data);
      localStorage.clear();

      window.location.href = "/userType";
      window.history.pushState(null, "", window.location.href);
    } else {
      console.error("Failed to sign out");
    }
  } catch (error) {
    console.error("Error during sign out:", error.message);
  }
};

export const getAuthHeaders = () => {
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  const accessToken = authTokens ? authTokens.access : null;

  return {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${accessToken}`,
  };
};

export const updateToken = async (token) => {
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

  if (authTokens) {
    const refreshToken = authTokens.refresh;

    const formData = new FormData();
    formData.append("refresh", refreshToken);

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/token/refresh/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Tokens Update success!");
        const newAuthTokens = {
          access: response.data.access, // Assuming the new access token is in response.data.access
          refresh: response.data.refresh, // Keep the same refresh token
        };
        localStorage.setItem("authTokens", JSON.stringify(newAuthTokens));
      } else {
        console.error("Failed to refresh tokens");
      }
    } catch (error) {
      console.error("Error refreshing tokens:", error.message);
      throw error;
    }
  }
};

export const AuthWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate(); // Move useNavigate hook to the component level

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (authTokens) {
      const interval = setInterval(() => {
        updateToken().catch((error) => {
          localStorage.clear(); // Clear localStorage on error
          navigate("/usertype"); // Navigate to /usertype on error
        });
      }, 180000); // 3 minutes in milliseconds

      return () => clearInterval(interval);
    }
  }, [navigate]);

  return (
    <>
      {!isOnline && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            background: "red",
            color: "white",
            padding: "10px",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          No internet connection. Please check your network.
        </div>
      )}
      {children}
    </>
  );
};
