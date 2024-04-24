import "./Profile.css";
import defaultImage from "../../../Assets/iconPerson.png";
import { useEffect, useState } from "react";
import CloseEyesIcon from "../../../Assets/closeeyes.png";
import OpenEyesIcon from "../../../Assets/openeyes.png";
// import axios from "axios";
function ProfilePage() {
  const [profileImage, setProfileImage] = useState("");

  const [getData, setGetData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("userInformation");
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      setGetData(parsedData[0]);
    } else {
      setGetData([]);
    }
  }, []);

  console.log(getData);

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
  // const handleChangeFirstName = (e) => {
  //   setfirstName(e.target.value);
  // };

  return (
    <>
      <div className="ProfilePage">
        <label className="profileImage">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <img className="" src={profileImage || defaultImage} alt="" />
        </label>

        <div>
          <div className="UserName">
            {getData.firstName + " " + getData.lastName}
          </div>

          <div className="MainDivProfile">
            <div className="MainContantProfile">
              <form>
                <div className="item_1">
                  <div className="NameOfField">First name</div>
                  <input
                    className="inputsPRofile"
                    type="text"
                    defaultValue={getData.firstName}
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
                    defaultValue={getData.lastName}
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
