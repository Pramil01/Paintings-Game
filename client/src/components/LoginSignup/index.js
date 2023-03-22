import React, { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Loader from "../Loader";
import api from "../../service/api";
import "./style.css";

const LoginSignup = () => {
  const [navigate, setNavigate] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const Initalize = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  useEffect(() => {
    var details = JSON.parse(localStorage.getItem("details"));
    const id = searchParams.get("id");
    if (details) {
      if (id) details["id"] = id;
      localStorage.setItem("details", JSON.stringify(details));
      setNavigate(true);
    }
    setShowLoader(false);
  }, [searchParams]);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      alert("Please fill all the fields");
      return;
    }
    var emailcheck = /^[A-Za-z0-9]{3,}[@]{1}[A-Za-z]{3,}[.]{1}[A-Za-z]{2,6}$/;
    if (!emailcheck.test(email)) {
      alert("Invalid Email Address !!");
      return;
    }
    if (password.length < 8) {
      alert("password is too short");
      return;
    }
    setShowLoader(true);
    let data = {
      username,
      email,
      password,
    };
    api
      .post("auth/", data)
      .then((res) => {
        console.log(res);
        setIsSignup(false);
        Initalize();
        setShowLoader(false);
        alert(res.data.msg);
      })
      .catch((err) => {
        setShowLoader(false);
        alert(err.response.data.msg);
        console.log(err.response);
      });
  };

  const handleLogin = (e) => {
    setShowLoader(true);
    e.preventDefault();
    let data = {
      email,
      password,
    };
    api
      .post("auth/login/", data)
      .then((res) => {
        const id = searchParams.get("id");
        let details = {
          username: res.data.details.username,
          worth: res.data.details.worth,
          email,
          id,
        };
        localStorage.setItem("details", JSON.stringify(details));
        setShowLoader(false);
        if (id) setNavigate(true);
        else alert("Wrong url");
      })
      .catch((err) => {
        setShowLoader(false);
        alert(err.response.data.msg);
        console(err.response);
      });
  };

  if (navigate) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="conatiner-log">
      {showLoader && <Loader />}
      <div className="main">
        <div className="signup">
          <form>
            <p
              className={`label ${!isSignup && "scaleDown"}`}
              onClick={() => {
                setIsSignup(true);
                Initalize();
              }}
              aria-hidden="true"
            >
              Sign up
            </p>
            <input
              className="input"
              type="text"
              name="txt"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required=""
            />
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required=""
            />
            <input
              className="input"
              type="password"
              name="pswd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              required=""
            />
            <button className="button" onClick={handleSignUp}>
              Sign up
            </button>
          </form>
        </div>

        <div className={`login ${!isSignup && "show"}`}>
          <form>
            <p
              className={`label ${!isSignup && "scaleUp"}`}
              onClick={() => {
                setIsSignup(false);
                Initalize();
              }}
              aria-hidden="true"
            >
              Login
            </p>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required=""
            />
            <input
              className="input"
              type="password"
              name="pswd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required=""
            />
            <button className="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
