import React, { useState, useEffect } from "react";

import { useUserAuth } from "../Context/userAuthContext";
import { Link } from "react-router-dom";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import "./profile.css";
import { db } from "../firebase";
import "./profile.css";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  Timestamp,
  updateDoc
} from "firebase/firestore";

function EditProfile() {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [blogs, setBlogs] = useState();
  const [currUser, setCurrUser] = useState();

  const { user } = useUserAuth();

  useEffect(() => {
    users &&
      users.map((checker) => {
        return checker.userId === user.uid
          ? (setUserName(checker.userName),
            setCurrUser(checker),
            setUserStatus(checker.userStatus),
            setUserAvatar(checker.userAvatar),
            setUserLocation(checker.userCountry))
          : "";
      });
  }, [users, user.uid]);
  useEffect(() => {
    const getUsersData = async () => {
      const get = await getDocs(collection(db, "users"));
      setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsersData();
    const getBlogsData = async () => {
      const get = await getDocs(collection(db, "blogs"));
      setBlogs(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getBlogsData();
  }, []);

  const fileHandler = (e) => {
    const [file] = e.target.files;
    setUserAvatar(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    users.map(async (soloUser) => {
      return soloUser.userId === user.uid
        ? await updateDoc(doc(db, "users", soloUser.id), {
            ...soloUser,
            userName,
            isEdit: false,
            userAvatar,
            userStatus,
            userCountry: userLocation
          })
        : "";
    });
    blogs.map(async (blog) => {
      return blog.userInfo.userId === user.uid
        ? updateDoc(doc(db, "blogs", blog.id), {
            ...blog,
            userInfo: { ...blog.userInfo, userName, userAvatar }
          })
        : blog;
    });
  };
  const handleCreateProfile = async () => {
    await addDoc(collection(db, "users"), {
      userEmail: user.email,
      userName,
      userAvatar,
      userStatus,
      userCountry: userLocation,
      userId: user.uid,
      userBlogs: [],
      userFavBlogs: [],
      followers: [],
      isEdit: false,
      following: [],
      joinedOn: Timestamp.now()
    });
  };
  return (
    <div className="editProfile-container">
      <div className="action-container ">
        <div>
          <input
            className="userName-input"
            type="text"
            value={userName}
            placeholder="userName"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <input
            className="location-input"
            type="text"
            placeholder="Location"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
          />
        </div>
        <div>
          <textarea
            className="status-input"
            type="text"
            placeholder="Status"
            value={userStatus}
            onChange={(e) => setUserStatus(e.target.value)}
          />
        </div>
        <div>
          <input
            className="file-button"
            id="file-input"
            type="file"
            onChange={(e) => {
              fileHandler(e);
            }}
          />
          <label for="file-input">
            <MdPhotoSizeSelectActual className="gallery-icon" />
          </label>
        </div>

        <div className="image-container">
          <img className="user-avatar" src={userAvatar} alt={"Avatar"} />
        </div>
        {currUser ? (
          currUser.isEdit === false ? (
            <Link to="/profile">
              <button
                className="save-btn"
                onClick={() => {
                  handleSaveProfile();
                }}
              >
                Save
              </button>
            </Link>
          ) : (
            ""
          )
        ) : (
          <Link to="/profile">
            <button
              className="save-btn"
              onClick={() => {
                handleCreateProfile();
              }}
            >
              Create
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
export default EditProfile;
