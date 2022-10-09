import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { BsChatDots } from "react-icons/bs";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../Context/userAuthContext";

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
                  : setRenderChat(false);
              })
            : "";
        });
    }
  });

  useEffect(() => {
    if (user) {
      profile &&
        profile.map((checker) => {
          return checker.userId.includes(user.uid) ? setRenderChat(true) : "";
        });
    }
  });
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
        <div>
          <Link to="/signUp" className="signUp-link">
            <p>Sign Up</p>
          </Link>
        </div>

        {user ? (
          <>
            <div>
              <p
                className="logOut-link"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  handleLogout();
                }}
              >
                LogOut
              </p>
            </div>
            <div>
              <Link to="/profile" className="profile-link">
                <p>Profile</p>
              </Link>
            </div>
            {renderChat === true ? (
              <div>
                <Link to="/chat" className="chat-link">
                  <BsChatDots />
                </Link>
              </div>
            ) : (
              ""
            )}

            <div className="nav-favroite">
              <Link to="/favourite">
                <BsStars className="favourite-icon" />
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Link to="/login" className="login-link">
              <p>Login</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default Navbar;
