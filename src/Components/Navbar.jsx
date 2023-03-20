import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../Context/userAuthContext";
import { AiOutlineHeart } from "react-icons/ai";

function Navbar() {
  const { user, logout } = useUserAuth();
  const [renderChat, setRenderChat] = useState(false);
  const [chats, setChats] = useState("");
  const [profile, setProfile] = useState();

  useEffect(() => {
    const getProfile = async () => {
      const get = await getDocs(collection(db, "users"));
      setProfile(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();

    const getChatsData = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChatsData();
  }, []);

  useEffect(() => {
    if (user) {
      profile &&
        profile.map((soloUser) => {
          return chats
            ? chats.map((chatDoc) => {
                return (soloUser.userId > user.uid
                  ? soloUser.userId + user.uid
                  : user.uid + soloUser.userId) === chatDoc.id
                  ? setRenderChat(true)
                  : "";
              })
            : "";
        });
    }
  });

  // useEffect(() => {
  //   if (user) {
  //     profile &&
  //       profile.map((checker) => {
  //         return checker.userId === user.uid ? setRenderChat(true) : "";
  //       });
  //   }
  // }, []);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="nav-container">
      <div className="nav-logo">
        <Link className="myLogo-Link" to="/">
          <p className="myLogo">blogMedia</p>
        </Link>
      </div>

      <div className="nav-actions">
        <div className="container-forLink">
          <Link to="/signUp" style={{ textDecoration: "none" }}>
            <span
              className="sign--Up"
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </span>
          </Link>
        </div>

        {user ? (
          <>
            <div className="container-forLink">
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                className="logOut"
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </span>
            </div>

            <div className="container-forLink">
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <span
                  className="profile"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Profile
                </span>
              </Link>
            </div>

            {renderChat === true ? (
              <div className="container-forLink">
                <Link to="/chat" style={{ textDecoration: "none" }}>
                  <BsChatDots
                    style={{
                      color: "white",
                      fontSize: "21px",
                      paddingLeft: "1rem",
                    }}
                  />
                </Link>
              </div>
            ) : (
              ""
            )}
            <div className="container-forLink">
              <Link to="/favourite" style={{ textDecoration: "none" }}>
                <AiOutlineHeart
                  style={{
                    color: "white",
                    fontSize: "23px",
                  }}
                />
              </Link>
            </div>
          </>
        ) : (
          <div className="container-forLink">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <span
                className="--login"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Login
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default Navbar;
