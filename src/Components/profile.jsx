import React, { useState, useEffect } from "react";
import { useUserAuth } from "../Context/userAuthContext";
import { Link, useLocation } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";

import {
  getDocs,
  collection,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./profile.css";
import Dummy from "./dummyProfile";

function Profile() {
  const location = useLocation();

  const { user } = useUserAuth();

  const [profile, setProfile] = useState();
  const [chats, setChats] = useState();
  const [newProfile, setNewProfile] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const get = await getDocs(collection(db, "users"));
      setProfile(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();

    const getChats = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChats();
  }, []);

  useEffect(() => {
    profile &&
      profile.map((checker) => {
        return checker.userId.includes(user.uid) ? setNewProfile(false) : "";
      });
    if (location.hash === "#singleUser") {
      setNewProfile(false);
    }
  }, [user.uid, profile, location.hash]);

  const idDecider = () => {
    if (location.hash === "#singleUser") {
      const { profileUser } = location.state;
      return profileUser.userId;
    } else {
      return user.uid;
    }
  };

  const handleFollow = async (person) => {
    const getProfile = async () => {
      const get = await getDocs(collection(db, "users"));
      setProfile(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();

    profile.map(async (you) => {
      return you.userId === user.uid
        ? await updateDoc(doc(db, "users", you.id), {
            ...you,
            following: [...you.following, person.userId],
          })
        : "";
    });

    await updateDoc(doc(db, "users", person.id), {
      ...person,
      followers: [...person.followers, user.uid],
    });
  };
  const handleUnfollow = async (person) => {
    const getProfile = async () => {
      const get = await getDocs(collection(db, "users"));
      setProfile(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();
    profile.map(async (you) => {
      return you.userId === user.uid
        ? await updateDoc(doc(db, "users", you.id), {
            ...you,
            following: [
              ...you.following.filter((checker) => {
                return checker !== person.userId;
              }),
            ],
          })
        : "";
    });

    await updateDoc(doc(db, "users", person.id), {
      ...person,
      followers: [
        ...person.followers.filter((checker) => {
          return checker !== user.uid;
        }),
      ],
    });
  };
  const handleMessage = async (person) => {
    let checkerBoolean = false;
    const combineId =
      person.userId > user.uid
        ? person.userId + user.uid
        : user.uid + person.userId;
    chats.map((checker) => {
      return checker.id === combineId ? (checkerBoolean = true) : "";
    });

    if (checkerBoolean === false) {
      await setDoc(doc(db, "chats", combineId), {
        messages: [],
      });
    }
  };

  return (
    <div className="profile-window">
      {newProfile === true ? <Dummy /> : ""}
      {profile
        ? profile.map((person, index) => {
            if (person.userId === idDecider()) {
              return (
                <>
                  <div className="profile-container" key={person.userId}>
                    <div className="profile-avatar">
                      <img
                        className="avatar"
                        src={
                          person.userAvatar === null
                            ? "Assets/user.jpg"
                            : person.userAvatar
                        }
                        alt="Avatar"
                      />
                    </div>
                    <div className="connections-container">
                      <p className="followers-container">
                        Followers : {person.followers.length}
                      </p>

                      <p className="following-container">
                        Following : {person.following.length}
                      </p>
                    </div>
                    {profile &&
                      profile.map((checker) => {
                        return checker.userId === user.uid ? (
                          <div key={checker.userId}>
                            {person.userId !== user.uid ? (
                              person.followers.includes(user.uid) ? (
                                <button
                                  className="Unfollow-btn"
                                  onClick={() => {
                                    handleUnfollow(person);
                                  }}
                                >
                                  Unfollow
                                </button>
                              ) : (
                                <button
                                  className="follow-btn"
                                  onClick={() => {
                                    handleFollow(person);
                                  }}
                                >
                                  Follow
                                </button>
                              )
                            ) : (
                              ""
                            )}

                            {person.followers.includes(user.uid) ? (
                              <Link
                                to={{ pathname: "/chat", hash: "#Message" }}
                                state={{
                                  personChannelId:
                                    person.userId > user.uid
                                      ? person.userId + user.uid
                                      : user.uid + person.userId,
                                }}
                              >
                                <button
                                  onClick={() => {
                                    handleMessage(person);
                                  }}
                                  className="message-btn"
                                >
                                  Message
                                </button>
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        );
                      })}
                    <p className="profile-name">{person.userEmail}</p>
                    <p className="profile-name">{person.userName}</p>
                    <div className="profile-location-container">
                      <MdLocationOn className="locationIcon" />
                      <p>{person.userCountry}</p>
                    </div>
                    <div className="profile-joiningDate">
                      <BsCalendarEvent className="calendar" />
                      <p>{person.joinedOn.toDate().toDateString()}</p>
                    </div>
                    <div className="profile-status">
                      <h4 className="status-text">Status:</h4>
                      <p style={{ marginLeft: "0.15rem" }}>
                        {person.userStatus}
                      </p>
                    </div>
                    {person.userId === user.uid ? (
                      <Link to="/editProfile">
                        <button className="edit-btn">Edit</button>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="allProfileBlogs-container" key={index}>
                    {person.userBlogs.map((blog) => {
                      return (
                        <div key={blog.blogId}>
                          <div className="profile-blogs">
                            <img
                              className="profile-blog-background"
                              src={blog.themeImg.image}
                              alt="Background Theme"
                            />
                            <div className="profileBlog-title">
                              <p
                                dangerouslySetInnerHTML={{ __html: blog.title }}
                              />
                            </div>
                            <div className="profileBlog-content">
                              <p
                                className="profileBlog-content-text"
                                dangerouslySetInnerHTML={{
                                  __html: blog.content,
                                }}
                              />
                            </div>

                            <div className="blog-actions">
                              <Link
                                className="ReadMoreLink"
                                to="/singleBlog"
                                state={{ blog: blog }}
                              >
                                <p className="read-text-blog">read more..</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            } else {
              return "";
            }
          })
        : ""}
    </div>
  );
}
export default Profile;
