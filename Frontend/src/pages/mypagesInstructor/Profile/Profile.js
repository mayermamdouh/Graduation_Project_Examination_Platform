import "./Profile.css";
import defaultImage from "../../../Assets/usericonn.png";
import { useEffect, useState } from "react";
import CloseEyesIcon from "../../../Assets/closeeyes.png";
import OpenEyesIcon from "../../../Assets/openeyes.png";
import axios from "axios";
import { getAuthHeaders } from "../component/file";
import Navbar from "../Navbar/AppBar";
// import axios from "axios";
function ProfilePage() {
  const [profileImage, setProfileImage] = useState("");

  const [getData, setGetData] = useState([]);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setProfileImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (JPEG, JPG, or PNG).");
      e.target.value = null;
    }
  };

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [Email, setEmail] = useState("");

  const [actionPass, setActionPass] = useState(CloseEyesIcon);
  const toggleEyes = () => {
    setActionPass((prevIcon) =>
      prevIcon === CloseEyesIcon ? OpenEyesIcon : CloseEyesIcon
    );
  };
//  http://127.0.0.1:8000/profile/
  const handleViewUserData = async (e) => {
    // setShowLoader(true);
     const authTokens = localStorage.getItem("authTokens")
       ? JSON.parse(localStorage.getItem("authTokens"))
       : null;

     // Extract the access token
     const accessToken = authTokens ? authTokens.access : null;
    //  console.log("", accessToken);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/profile/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setGetData(response.data);
      
      } else {
        console.error("Failed to View Group");
      }
    } catch (error) {
      console.error("Error View Group:", error.message);
    }
  };

  useEffect(() => {
    handleViewUserData();
  },[]);
console.log("getData: ", getData);
  return (
    <>
      <Navbar />
      <div className="ProfilePage">
        <label className="profileImage">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <img
            className="paddingggg"
            src={profileImage || defaultImage}
            alt=""
          />
        </label>

        <div>
          <div className="UserName">{getData.username}</div>

          <div className="MainDivProfile">
            <div className="MainContantProfile">
              <form>
                <div className="item_1">
                  <div className="NameOfField">First name</div>
                  <input
                    className="inputsPRofile"
                    type="text"
                    defaultValue={getData.first_name}
                    onChange={(e) => {
                      setfirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="lineSeprateProfile"></div>
                <div className="item_2">
                  <div className="NameOfField">Last name</div>
                  <input
                    className="inputsPRofile"
                    type="text"
                    defaultValue={getData.last_name}
                    onChange={(e) => {
                      setlastName(e.target.value);
                    }}
                  />
                </div>
                <div className="lineSeprateProfile"></div>
                <div className="item_3">
                  <div className="NameOfField">Email</div>
                  <input
                    className="inputsPRofile"
                    type="text"
                    defaultValue={getData.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div className="lineSeprateProfile"></div>
                <div className="item_4">
                  <div className="NameOfField">Old password</div>
                  <div className="sectionPassword">
                    <input className="inputsPRofile" type={"password"} />
                  </div>
                </div>
                <div className="item_4">
                  <div className="NameOfField">New password</div>
                  <div className="sectionPassword">
                    <input className="inputsPRofile" type={"password"} />
                    <img
                      src={actionPass}
                      loading="lazy"
                      alt=""
                      className="eyestoggle"
                      onClick={toggleEyes}
                    />
                  </div>
                </div>
                <div className="item_4">
                  <div className="NameOfField">confirm new password </div>
                  <div className="sectionPassword">
                    <input className="inputsPRofile" type={"password"} />
                    <img
                      src={actionPass}
                      loading="lazy"
                      alt=""
                      className="eyestoggle"
                      onClick={toggleEyes}
                    />
                  </div>
                </div>
              </form>
            </div>
            <button className="ButtonUpdatee">Update</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
