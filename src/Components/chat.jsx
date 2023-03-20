import React, { useState, useEffect, useRef, createRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../Context/userAuthContext";
import { db } from "../firebase";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import { BiCheckDouble } from "react-icons/bi";
import { IoIosPaperPlane } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import Draggable from "react-draggable";

import "./chat.css";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";

function Chat() {
  const { user } = useUserAuth();
  const location = useLocation();
  const [tagg, setTagg] = useState({
    boolean: false,
    message: "",
  });
  const [input, setInput] = useState("");
  const [taggedInput, setTaggedInput] = useState("");
  const [users, setUsers] = useState("");
  const [chats, setChats] = useState("");
  const [channelId, setChannelId] = useState("");
  const [selectedMate, setSelectedMate] = useState("");
  const [selected, setSelected] = useState(false);
  const [search, setSearch] = useState("");
  const [shareBoolean, setShareBoolean] = useState(false);
  const [sharedBlog, setSharedBlog] = useState("");
  const [renderBtn, setRenderBtn] = useState(false);
  const [participant, setParticipant] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [position, setPosition] = useState({ x: 0 });
  const [taggedMsg, setTaggedMsg] = useState("");
  const [messages, setMessages] = useState("");
  const [refs, setRefs] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleaggedChange = (e) => {
    setTaggedInput(e.target.value);
  };

  const handleTaggClick = (e, message) => {
    setTaggedMsg(e.target.innerHTML);
    setTimeout(() => {
      setTaggedMsg("");
    }, 2000);

    refs[
      message.taggedText.taggedMesg.createdAt.seconds
    ].current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSend = async () => {
    console.log("messages", messages);
    closeTagg();
    const msg = {
      userChatId: user.uid,
      createdAt: Timestamp.now(),
      text: input,
      taggedText: {
        taggedMesg: tagg.message,
        myText: taggedInput,
      },
      blog: sharedBlog,
      taggedBlog: {
        blog: sharedBlog,
        myText: input,
      },
      isSeen: false,
    };

    const getChatData = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChatData();
    chats.map(async (connection) => {
      return connection.id === channelId.id
        ? await updateDoc(doc(db, "chats", connection.id), {
            messages: arrayUnion(msg),
          })
        : "";
    });

    setInput("");
    setTaggedInput("");
  };

  useEffect(() => {
    const getUsersData = async () => {
      const get = await getDocs(collection(db, "users"));
      setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsersData();

    const getChatsData = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChatsData();

    const decideId = () => {
      if (location.hash === "#Message") {
        const { personChannelId } = location.state;
        setChannelId(personChannelId);
      }
      if (location.hash === "#shareBlog") {
        const { blog } = location.state;
        setShareBoolean(true);
        setSharedBlog(blog);
      }
    };
    decideId();
  }, [location]);

  const handleSelect = async (soloUser, chatDoc) => {
    // setting messages state on selecting the chatId.
    chats &&
      chats.map((chat) => {
        return chat.id === channelId.id ? setMessages(chat.messages) : "";
      });

    const refs =
      messages &&
      messages.reduce((acc, value) => {
        acc[value.createdAt.seconds] = createRef();
        return acc;
      }, {});

    setRefs(refs);

    closeTagg();
    const getChatData = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChatData();
    const updateSeen = async () => {
      let newChatData;
      chats.map((chat) => {
        return chat.id === chatDoc.id
          ? (newChatData = [
              ...chat.messages.map((msg) => {
                return { ...msg, isSeen: true };
              }),
            ])
          : "";
      });
      return await updateDoc(doc(db, "chats", chatDoc.id), {
        messages: newChatData,
      });
    };
    const chatData = chats.map((c) => {
      return c.id === chatDoc.id
        ? c.messages.length
          ? c.messages[c.messages.length - 1].userChatId
          : ""
        : "";
    });

    chatData.map((c) => {
      if (user.uid !== c) {
        if (c !== "") {
          return updateSeen();
        }
      }
      return "";
    });

    if (selectedMate.userId === soloUser.userId) {
      setSelectedMate(soloUser);
      setChannelId(chatDoc);
    } else {
      setSelectedMate(soloUser);
      setChannelId(chatDoc);
      setSelected(true);
    }
  };

  const handleValue = (e) => {
    setSearch(e.target.value);
  };
  const handleTrigger = () => {
    setChannelId("");
    setSelectedMate("");
    users.map((checker) => {
      return checker.userName.includes(search)
        ? setSearchResults([checker.userId])
        : "";
    });
    setSearch("");
  };

  const ref = useRef();
  useEffect(() => {
    return ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleShareSelect = (soloUser) => {
    setRenderBtn(true);
    setParticipant([...participant, soloUser.userId]);
  };

  const handleShare = () => {
    const msg = {
      userChatId: user.uid,
      createdAt: Timestamp.now(),
      text: input,
      blog: sharedBlog,
      isSeen: false,
    };
    participant.map((friend) => {
      const combineId =
        friend > user.uid ? friend + user.uid : user.uid + friend;
      return chats.map(async (checker) => {
        return checker.id === combineId
          ? await updateDoc(doc(db, "chats", checker.id), {
              messages: arrayUnion(msg),
            })
          : "";
      });
    });

    setParticipant([]);
    setShareBoolean(false);
    setRenderBtn(false);
  };
  const handleFilter = (friend) => {
    setParticipant(
      participant.filter((checker) => {
        return checker !== friend;
      })
    );
    if (participant.length === 1) {
      setRenderBtn(false);
    }
  };
  const handleSearchSelect = (friend) => {
    const combineId =
      friend.userId > user.uid
        ? friend.userId + user.uid
        : user.uid + friend.userId;
    return chats.map((chatDoc) => {
      return combineId === chatDoc.id
        ? (setSearchResults([]), handleSelect(user, chatDoc))
        : "";
    });
  };

  const taggMe = (msg) => {
    setTagg({
      boolean: true,
      message: msg,
    });
  };
  const closeTagg = () => {
    setTagg({
      boolean: false,
      message: "",
    });
  };

  const trackPos = (data, message) => {
    setPosition({ x: data.x });
    if (position.x > 75) {
      taggMe(message);
    }

    if (position.x < 50) {
      closeTagg();
    }
  };
  const endMe = (data) => {
    setPosition({ x: 0 });
  };

  return (
    <div className="chat-window">
      <div className="chat-container">
        <div className="users-container">
          <div className="userNav-container">
            {users
              ? users.map((person) => {
                  return person.userId === user.uid ? (
                    <div className="chatOwner-container" key={person.userId}>
                      <div className="userImageAndName">
                        <img
                          className="userImage-container"
                          src={
                            person.userAvatar === null
                              ? "Assets/user.jpg"
                              : person.userAvatar
                          }
                          alt="Avatar"
                        />
                        <p>{person.userName}</p>
                      </div>
                      {searchResults.length ? (
                        <BsArrowLeft
                          className="goBack-btn"
                          onClick={() => {
                            setSearchResults([]);
                          }}
                        />
                      ) : (
                        <BsThreeDotsVertical className="dots" />
                      )}
                    </div>
                  ) : (
                    ""
                  );
                })
              : ""}
          </div>
          <div className="search-input-btn-conatiner">
            <input
              className="user-input"
              value={search}
              type="text"
              placeholder="Search a user"
              onChange={(e) => {
                handleValue(e);
              }}
            />
            {search.length ? (
              <AiOutlineSearch
                className="search-user"
                onClick={() => {
                  handleTrigger();
                }}
              />
            ) : (
              ""
            )}
          </div>
          {searchResults.length ? (
            <div className="userSearchList-container">
              {searchResults &&
                searchResults.map((friend, index) => {
                  return users.map((user) => {
                    return user.userId === friend ? (
                      <div
                        className="user-container"
                        onClick={() => {
                          handleSearchSelect(user);
                        }}
                      >
                        <img
                          className="userImage-container"
                          src={
                            user.userAvatar === null
                              ? "Assets/user.jpg"
                              : user.userAvatar
                          }
                          alt="Avatar"
                        />
                        <p>{user.userName}</p>
                      </div>
                    ) : (
                      ""
                    );
                  });
                })}
            </div>
          ) : (
            <div className="userList-container">
              {users
                ? users.map((soloUser) => {
                    return chats
                      ? chats.map((chatDoc) => {
                          return (soloUser.userId > user.uid
                            ? soloUser.userId + user.uid
                            : user.uid + soloUser.userId) === chatDoc.id ? (
                            shareBoolean !== true ? (
                              <div
                                key={chatDoc.id}
                                className={
                                  selectedMate.userId !== soloUser.userId
                                    ? "user-container"
                                    : "user-containerSelected"
                                }
                                onClick={() => {
                                  handleSelect(soloUser, chatDoc);
                                }}
                              >
                                <img
                                  className="userImage-container"
                                  src={
                                    soloUser.userAvatar === null
                                      ? "Assets/user.jpg"
                                      : soloUser.userAvatar
                                  }
                                  alt="Avatar"
                                />
                                <p>{soloUser.userName}</p>
                              </div>
                            ) : (
                              <div
                                className={
                                  selected === false
                                    ? "user-container"
                                    : "user-containerSelected"
                                }
                              >
                                <img
                                  className="userImage-container"
                                  src={soloUser.userAvatar}
                                  alt="Avatar"
                                />
                                <p>{soloUser.userName}</p>
                                {participant.includes(soloUser.userId) ? (
                                  <div className="blue"></div>
                                ) : (
                                  <div
                                    className="white"
                                    onClick={() => {
                                      handleShareSelect(soloUser);
                                    }}
                                  ></div>
                                )}
                              </div>
                            )
                          ) : (
                            ""
                          );
                        })
                      : "";
                  })
                : ""}
              {renderBtn === true ? (
                <div className="shareInfo-Container">
                  <div className="friendsName-container">
                    {participant &&
                      participant.map((friend, index) => {
                        return users.map((person) => {
                          return person.userId === friend ? (
                            <div
                              className="shareName-container"
                              key={person.userId}
                            >
                              <p className="name">{person.userName}</p>
                              <MdClose
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleFilter(friend);
                                }}
                              />
                            </div>
                          ) : (
                            ""
                          );
                        });
                      })}
                  </div>
                  <div>
                    <div className="share-Btnstyler">
                      <BsArrowRight
                        className="checker"
                        onClick={() => {
                          handleShare();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        <div className="chatDisplay-container">
          <div className="chatNav-container">
            {selectedMate ? (
              <div className="chatUserNav-container">
                <img
                  className="userImage-container"
                  src={
                    selectedMate.userAvatar === null
                      ? "Assets/user.jpg"
                      : selectedMate.userAvatar
                  }
                  alt="Avatar"
                />
                <p>{selectedMate.userName}</p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="chat-display">
            {selected === true ? (
              <div className="message-container">
                {/* <ScrollableFeed> */}
                {chats
                  ? chats.map((chat) => {
                      return chat.id === channelId.id
                        ? chat.messages.map((message, index) => {
                            if (message.text !== "") {
                              return (
                                <Draggable
                                  bounds={{ left: 0, right: 100 }}
                                  position={{ x: 0, y: 0 }}
                                  onDrag={(e, data) => {
                                    trackPos(data, message, e);
                                  }}
                                  axis="x"
                                  onStop={(e, data) => {
                                    endMe(data);
                                  }}
                                >
                                  <div
                                    className={
                                      taggedMsg === message.text
                                        ? "changeBagColor"
                                        : ""
                                    }
                                  >
                                    <div
                                      className="messageShaper"
                                      key={message.userChatId}
                                    >
                                      {message.userChatId === user.uid ? (
                                        <>
                                          <div
                                            className={
                                              message.userChatId === user.uid
                                                ? "sender"
                                                : "receiver"
                                            }
                                          >
                                            <p
                                              ref={
                                                refs[message.createdAt.seconds]
                                              }
                                            >
                                              {message.text}
                                            </p>

                                            {message.isSeen === true ? (
                                              <BiCheckDouble className="doubleTicks-seen" />
                                            ) : (
                                              <BiCheckDouble className="doubleTicks-notSeen" />
                                            )}
                                          </div>
                                          <div
                                            className={
                                              message.userChatId === user.uid
                                                ? "triangle-right"
                                                : "triangle-left"
                                            }
                                          ></div>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className={
                                              message.userChatId === user.uid
                                                ? "triangle-right"
                                                : "triangle-left"
                                            }
                                          ></div>
                                          <div
                                            className={
                                              message.userChatId === user.uid
                                                ? "sender"
                                                : "receiver"
                                            }
                                          >
                                            <p
                                              ref={
                                                refs[message.createdAt.seconds]
                                              }
                                            >
                                              {message.text}
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </Draggable>
                              );
                            } else if (
                              message.taggedText &&
                              message.taggedText.taggedMesg !== ""
                            ) {
                              return (
                                <div
                                  className="messageShaper-tagged"
                                  // this ref is important
                                  ref={ref}
                                  key={message.userChatId}
                                >
                                  {message.userChatId === user.uid ? (
                                    <>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "sender"
                                            : "receiver"
                                        }
                                      >
                                        <span className="full-container">
                                          <div
                                            className="tagg-textContainer"
                                            onClick={(e) => {
                                              handleTaggClick(e, message);
                                            }}
                                          >
                                            <p className="whoTaggedIn">
                                              {" "}
                                              {user.uid ===
                                              message.taggedText.taggedMesg
                                                .userChatId
                                                ? "You"
                                                : users.map((soloUser) => {
                                                    return soloUser.userId ===
                                                      message.taggedText
                                                        .taggedMesg.userChatId
                                                      ? soloUser.userName
                                                      : "";
                                                  })}
                                            </p>
                                            <p
                                              className="taggedText"
                                              // this ref is also imp.
                                              ref={ref}
                                            >
                                              {
                                                message.taggedText.taggedMesg
                                                  .text
                                              }
                                            </p>
                                          </div>
                                          <p>{message.taggedText.myText}</p>
                                        </span>

                                        {message.isSeen === true ? (
                                          <BiCheckDouble className="doubleTicks-seen" />
                                        ) : (
                                          <BiCheckDouble className="doubleTicks-notSeen" />
                                        )}
                                      </div>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "triangle-right"
                                            : "triangle-left"
                                        }
                                      ></div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "triangle-right"
                                            : "triangle-left"
                                        }
                                      ></div>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "sender"
                                            : "receiver"
                                        }
                                      >
                                        <span className="full-Container">
                                          <div
                                            className="tagg-textContainer-receiver"
                                            onClick={(e) => {
                                              handleTaggClick(e, message);
                                            }}
                                          >
                                            <p className="whoTaggedIn">
                                              {" "}
                                              {user.uid ===
                                              message.taggedText.taggedMesg
                                                .userChatId
                                                ? "You"
                                                : users.map((soloUser) => {
                                                    return soloUser.userId ===
                                                      message.taggedText
                                                        .taggedMesg.userChatId
                                                      ? soloUser.userName
                                                      : "";
                                                  })}
                                            </p>
                                            <p className="taggedText">
                                              {
                                                message.taggedText.taggedMesg
                                                  .text
                                              }
                                            </p>
                                          </div>
                                          <p>{message.taggedText.myText}</p>
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div className="messageShaper-blog" ref={ref}>
                                  {message.userChatId === user.uid ? (
                                    <>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "sender-blog"
                                            : "receiver-blog"
                                        }
                                      >
                                        <div className="shareBlog-container">
                                          <div className="shareBlogImg-container">
                                            <img
                                              className="shareBlog-img"
                                              src={message.blog.blog.themeImg}
                                              alt="theme"
                                            />
                                          </div>
                                          <div className="shareBlog-description">
                                            <p className="description-title">
                                              {message.blog.blog.title}
                                            </p>
                                            <p className="description-content">
                                              {message.blog.blog.content}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="Liknk-seen-container">
                                          <div className="shareBlog-Link">
                                            <Link
                                              className="ReadMoreLink"
                                              to="/singleBlog"
                                              state={{
                                                blog: message.blog.blog,
                                              }}
                                            >
                                              <p
                                                style={{ paddingTop: "2px" }}
                                                className="ShareReadText"
                                              >
                                                Read more...
                                              </p>
                                            </Link>
                                          </div>

                                          {message.isSeen === true ? (
                                            <BiCheckDouble className="blogDoubleTicks-seen" />
                                          ) : (
                                            <BiCheckDouble className="blogDoubleTicks-notSeen" />
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "triangle-right"
                                            : "triangle-left"
                                        }
                                      ></div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "triangle-right"
                                            : "triangle-left"
                                        }
                                      ></div>
                                      <div
                                        className={
                                          message.userChatId === user.uid
                                            ? "sender-blog"
                                            : "receiver-blog"
                                        }
                                      >
                                        <div className="shareBlog-container">
                                          <div className="shareBlogImg-container">
                                            <img
                                              className="shareBlog-img"
                                              src={message.blog.blog.themeImg}
                                              alt="theme"
                                            />
                                          </div>
                                          <div className="shareBlog-description">
                                            <p className="description-title">
                                              {message.blog.blog.title}
                                            </p>
                                            <p className="description-content">
                                              {message.blog.blog.content}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="Liknk-seen-container">
                                          <div className="shareBlog-Link">
                                            <Link
                                              className="ReadMoreLink"
                                              to="/singleBlog"
                                              state={{
                                                blog: message.blog.blog,
                                              }}
                                            >
                                              <p
                                                style={{ paddingTop: "2px" }}
                                                className="ShareReadText"
                                              >
                                                Read more...
                                              </p>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            }
                            //   return message.text !== "" ? (
                            //     <div
                            //       className="messageShaper"
                            //       ref={ref}
                            //       key={message.userChatId}
                            //     >
                            //       {message.userChatId === user.uid ? (
                            //         <>
                            //           <div
                            //             onDoubleClick={() => {
                            //               taggMe(message);
                            //             }}
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "sender"
                            //                 : "receiver"
                            //             }
                            //           >
                            //             <p>{message.text}</p>

                            //             {message.isSeen === true ? (
                            //               <BiCheckDouble className="doubleTicks-seen" />
                            //             ) : (
                            //               <BiCheckDouble className="doubleTicks-notSeen" />
                            //             )}
                            //           </div>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "triangle-right"
                            //                 : "triangle-left"
                            //             }
                            //           ></div>
                            //         </>
                            //       ) : (
                            //         <>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "triangle-right"
                            //                 : "triangle-left"
                            //             }
                            //           ></div>
                            //           <div
                            //             onDoubleClick={() => {
                            //               taggMe(message);
                            //             }}
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "sender"
                            //                 : "receiver"
                            //             }
                            //           >
                            //             <p>{message.text}</p>
                            //           </div>
                            //         </>
                            //       )}
                            //     </div>
                            //   ) : (
                            //     // for blog
                            //     <div className="messageShaper-blog" ref={ref}>
                            //       {message.userChatId === user.uid ? (
                            //         <>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "sender-blog"
                            //                 : "receiver-blog"
                            //             }
                            //           >
                            //             <div className="shareBlog-container">
                            //               <div className="shareBlogImg-container">
                            //                 <img
                            //                   className="shareBlog-img"
                            //                   src={message.blog.blog.themeImg}
                            //                   alt="theme"
                            //                 />
                            //               </div>
                            //               <div className="shareBlog-description">
                            //                 <p className="description-title">
                            //                   {message.blog.blog.title}
                            //                 </p>
                            //                 <p className="description-content">
                            //                   {message.blog.blog.content}
                            //                 </p>
                            //               </div>
                            //             </div>
                            //             <div className="Liknk-seen-container">
                            //               <div className="shareBlog-Link">
                            //                 <Link
                            //                   className="ReadMoreLink"
                            //                   to="/singleBlog"
                            //                   state={{ blog: message.blog.blog }}
                            //                 >
                            //                   <p
                            //                     style={{ paddingTop: "2px" }}
                            //                     className="ShareReadText"
                            //                   >
                            //                     Read more...
                            //                   </p>
                            //                 </Link>
                            //               </div>

                            //               {message.isSeen === true ? (
                            //                 <BiCheckDouble className="blogDoubleTicks-seen" />
                            //               ) : (
                            //                 <BiCheckDouble className="blogDoubleTicks-notSeen" />
                            //               )}
                            //             </div>
                            //           </div>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "triangle-right"
                            //                 : "triangle-left"
                            //             }
                            //           ></div>
                            //         </>
                            //       ) : (
                            //         <>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "triangle-right"
                            //                 : "triangle-left"
                            //             }
                            //           ></div>
                            //           <div
                            //             className={
                            //               message.userChatId === user.uid
                            //                 ? "sender-blog"
                            //                 : "receiver-blog"
                            //             }
                            //           >
                            //             <div className="shareBlog-container">
                            //               <div className="shareBlogImg-container">
                            //                 <img
                            //                   className="shareBlog-img"
                            //                   src={message.blog.blog.themeImg}
                            //                   alt="theme"
                            //                 />
                            //               </div>
                            //               <div className="shareBlog-description">
                            //                 <p className="description-title">
                            //                   {message.blog.blog.title}
                            //                 </p>
                            //                 <p className="description-content">
                            //                   {message.blog.blog.content}
                            //                 </p>
                            //               </div>
                            //             </div>
                            //             <div className="Liknk-seen-container">
                            //               <div className="shareBlog-Link">
                            //                 <Link
                            //                   className="ReadMoreLink"
                            //                   to="/singleBlog"
                            //                   state={{ blog: message.blog.blog }}
                            //                 >
                            //                   <p
                            //                     style={{ paddingTop: "2px" }}
                            //                     className="ShareReadText"
                            //                   >
                            //                     Read more...
                            //                   </p>
                            //                 </Link>
                            //               </div>
                            //             </div>
                            //           </div>
                            //         </>
                            //       )}
                            //     </div>
                            //   );
                          })
                        : "";
                    })
                  : ""}
                {/* </ScrollableFeed> */}
              </div>
            ) : (
              <div className="message-container-text">
                <p className="chat-text">
                  Select a user to chat! or follow someone to message them!
                </p>
              </div>
            )}
            {selected === false ? (
              ""
            ) : tagg.boolean === false ? (
              <div className="input-container">
                <input
                  className="chat-input"
                  value={input}
                  type="text"
                  placeholder="Message..."
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                {input.length ? (
                  <div className="sendBtn-container">
                    <IoIosPaperPlane
                      className="send-icon"
                      onClick={() => {
                        handleSend();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="inputTagg-container">
                <div className="taggedMesg-conatiner">
                  <div className="name-close">
                    <p className="authorOfMessage">
                      {user.uid === tagg.message.userChatId
                        ? "You"
                        : users.map((soloUser) => {
                            return soloUser.userId === tagg.message.userChatId
                              ? soloUser.userName
                              : "";
                          })}
                    </p>
                    <MdClose
                      className="close-icon"
                      onClick={() => {
                        closeTagg();
                      }}
                    />
                  </div>

                  <p>{tagg.message.text}</p>
                </div>
                <span className="flexed-inputAndBtn">
                  <input
                    className="chat-input"
                    value={taggedInput}
                    type="text"
                    placeholder="Message..."
                    onChange={(e) => {
                      handleaggedChange(e);
                    }}
                  />
                  {taggedInput.length ? (
                    <div className="sendBtn-container">
                      <IoIosPaperPlane
                        className="send-icon"
                        onClick={() => {
                          handleSend();
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;
