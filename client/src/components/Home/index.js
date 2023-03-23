import React, { useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";
import api from "../../service/api";
import "./style.css";

const Home = () => {
  const [details, setDetails] = useState([]);
  const [userData, setUserData] = useState({});
  const [navigate, setNavigate] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useLayoutEffect(() => {
    var user = JSON.parse(localStorage.getItem("details"));
    setUserData(user);
    api
      .get("painting/?id=" + user.id)
      .then((res) => {
        console.log(res.data);
        setDetails(res.data.details);
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const handlePurchase = () => {
    if (details[2] !== "None" && userData.email === details[2].split(":")[1]) {
      alert("You already own this painting");
      return;
    }
    if (parseFloat(userData.worth) < parseFloat(details[1])) {
      alert("You don't have enough worth to buy this painting");
      return;
    }
    setShowLoader(true);
    const sEmail = details[2] === "None" ? "None" : details[2].split(":")[1];
    let data = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      sEmail,
    };
    api
      .post("painting/", data)
      .then((res) => {
        let newDetails = [
          details[0],
          res.data.newData[0],
          userData.username + ":" + userData.email,
          details[3],
          res.data.newData[3],
          res.data.newData[4],
        ];
        setDetails(newDetails);
        setUserData({ ...userData, worth: res.data.newBalance });
        localStorage.setItem(
          "details",
          JSON.stringify({ ...userData, worth: res.data.newBalance })
        );
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err.response);
        setShowLoader(false);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    setNavigate(true);
  };

  if (navigate) {
    return <Navigate to={`/?id=${userData.id}`} />;
  }
  // return details ? (
  //   <div>
  //     <ul>
  //       <li>
  //         Current Owner :{" "}
  //         {details[2] === "None" ? "No Owner Yet" : details[2].split(":")[0]}
  //       </li>
  //       <li>Price : {parseFloat(details[1]).toFixed(2)}</li>
  //       <li>Your Worth : {parseFloat(userData.worth).toFixed(2)}</li>
  //       <li>Your Username : {userData.username}</li>
  //       <li>
  //         <button onClick={handlePurchase}>Buy</button>
  //       </li>
  //     </ul>
  //   </div>
  // ) : (
  //   <div>Please wait</div>
  // );
  return (
    <div className="outer-container">
      {showLoader && <Loader />}
      <div className="container">
        {/* <!--Div for Logo --> */}
        <div className="top-section">
          {/* <!--Links --> */}
          <div className="links">
            <h1>{userData.username}</h1>
            <h2>Your Wallet : {parseFloat(userData.worth).toFixed(2)} coins</h2>
          </div>

          {/* <!-- Button --> */}
          <div className="top-button">
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        <div className="main-div">
          <div className="left-div">
            {/* <!--NFT Stuff --> */}
            <div className="nft-stuff">
              <h4>
                Current Owner :{" "}
                {details.length !== 0 &&
                  (details[2] === "None"
                    ? "No Owner Yet"
                    : details[2].split(":")[0])}
              </h4>
              <h4>Price : {parseFloat(details[1]).toFixed(2)}</h4>
              <h4>
                Purchase and sell at{" "}
                {parseFloat(
                  (100 - parseFloat(details[1])) * 0.37 + parseFloat(details[1])
                ).toFixed(2)}
              </h4>
            </div>

            <br />

            {/* <!-- Call To Action --> */}
            <div className="cta">
              <button onClick={handlePurchase}>Buy</button>
            </div>
          </div>

          {/* <!--Right-div -->  */}
          <div className="right-div">
            <div className="image-div">
              <img
                src="https://i.pinimg.com/564x/d4/00/7d/d4007d190577007f71d20f1ae7a2ab58.jpg"
                alt="Travis Scott"
                width="300"
              />
            </div>
          </div>
        </div>

        {/* <!-- Credit --> */}
        <div className="ebenny">
          <p>
            Shot By :{" "}
            <a
              href="https://github.com/Pramil01/"
              target="_blank"
              rel="noreferrer"
            >
              Pramil
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
