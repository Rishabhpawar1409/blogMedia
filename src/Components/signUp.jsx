import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/userAuthContext";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import "./login&signUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [eye, setEye] = useState(false);
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");
    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
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
      <div className="signUp">
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
            handleSignUp();
          }}
        >
          Sign Up
        </button>
        <p className="signUp-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
export default SignUp;
