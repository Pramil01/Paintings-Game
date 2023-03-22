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
          <div className="logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-stars"
              viewBox="0 0 16 16"
            >
              <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
            </svg>
          </div>

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
