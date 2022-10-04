import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./login&signUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/userAuthContext";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [eye, setEye] = useState(false);

  const { login, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };
  const handleGoogleLogIn = async () => {
    try {
      await googleSignIn();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };
  const weWillDecide = () => {
    if (eye === false) {
      return "password";
    }
    return "text";
  };
  return (
    <div className="login-container">
      <div className="login">
        <h2 className="header-1">blogMedia</h2>
        {error && (
          <Alert className="error" variant="danger">
            {error}
          </Alert>
        )}
        <input
          type="email"
          className="input"
          placeholder="Email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="input-password-container">
          <input
            type={weWillDecide()}
            className="input-password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {password.length ? (
            eye === false ? (
              <div className="eye-container">
                <FaEyeSlash onClick={() => setEye(true)} />
              </div>
            ) : (
              <div className="eye-container">
                <FaEye onClick={() => setEye(false)} />
              </div>
            )
          ) : (
            ""
          )}
        </div>

        <button
          className="button-login"
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </button>

        <p className="orText">or</p>

        <div
          className="googleBtn-container"
          onClick={() => {
            handleGoogleLogIn();
          }}
        >
          <FcGoogle className="google-icon" />
          <p className="login-text">Login with Google</p>
        </div>
        <p className="signUp-text">
          Don't have an account? <Link to="/signUp">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
