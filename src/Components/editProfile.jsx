import React, { useState, useEffect } from "react";

import { useUserAuth } from "../Context/userAuthContext";
import { Link } from "react-router-dom";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import "./profile.css";
import { db, storage } from "../firebase";
import "./profile.css";
import uuid from "react-uuid";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditProfile() {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [blogs, setBlogs] = useState();
  const [currUser, setCurrUser] = useState();
  const [imageFile, setImageFile] = useState(null);

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
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (file) {
      if (allowedTypes.includes(file.type)) {
        console.log("Valid file!");
        setImageFile(file);
      } else console.log("Invalid image, cannot upload!");
    }
  };
  const handleUploadImage = async () => {
    const id = uuid();
    if (imageFile !== null) {
      const image = `images/${imageFile.name + id}`;
      const imageRef = ref(storage, `images/${imageFile.name + id}`);
      try {
        await uploadBytes(imageRef, imageFile);

        const imageUrl = await getDownloadURL(imageRef);
        setUserAvatar(imageUrl);
      } catch (err) {
        console.log("Got error:", err);
      }
    }
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
            userCountry: userLocation,
          })
        : "";
    });
    blogs.map(async (blog) => {
      return blog.userInfo.userId === user.uid
        ? updateDoc(doc(db, "blogs", blog.id), {
            ...blog,
            userInfo: { ...blog.userInfo, userName, userAvatar },
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
      joinedOn: Timestamp.now(),
    });
  };
  return (
    <div className="editProfile-container">
      <div className="action-container ">
        <span style={{ color: "#E96479" }}>
          * Complete your profile, by filling all the details!
        </span>
        <div>
          <input
            maxLength={30}
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
            maxLength={25}
            type="text"
            placeholder="Location"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
          />
        </div>
        <div>
          <textarea
            maxLength={100}
            className="status-input"
            type="text"
            placeholder="Status"
            value={userStatus}
            onChange={(e) => setUserStatus(e.target.value)}
          />
        </div>
        {imageFile !== null ? (
          <>
            <button
              className="upload-btn"
              onClick={() => {
                handleUploadImage();
              }}
            >
              Upload
            </button>
            <span
              style={{ cursor: "pointer", marginTop: "0.45rem" }}
              onClick={() => {
                setImageFile(null);
              }}
            >
              Cancel!
            </span>
          </>
        ) : (
          <div>
            <input
              className="file-button"
              id="file-input"
              type="file"
              onChange={(e) => {
                fileHandler(e);
              }}
            />
            <label htmlFor="file-input">
              <MdPhotoSizeSelectActual className="gallery-icon" />
            </label>
          </div>
        )}
        <div className="image-container">
          <img
            className="user-avatar"
            src={userAvatar === null ? "Assets/user.jpg" : userAvatar}
            alt={"Avatar"}
          />
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
              disabled={
                userAvatar === "" || userLocation === "" || userStatus === ""
              }
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
