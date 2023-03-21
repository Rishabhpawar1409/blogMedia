import React from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { TbSend } from "react-icons/tb";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState, useEffect } from "react";
import { useUserAuth } from "../Context/userAuthContext";
import { db } from "../firebase";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Home = () => {
  const [blogData, setBlogData] = useState();
  const [users, setUsers] = useState();
  const [chats, setChats] = useState();
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favBlogsList, setFavBlogsList] = useState([]);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogsData = async () => {
      const get = await getDocs(collection(db, "blogs"));
      setBlogData(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getBlogsData();

    const getChatsData = async () => {
      const get = await getDocs(collection(db, "chats"));
      setChats(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getChatsData();

    const getUsersData = async () => {
      const get = await getDocs(collection(db, "users"));
      setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const temp_users = get.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const blogsList = [];
      temp_users.map((checker) => {
        if (user) {
          if (user.uid === checker.userId) {
            checker.userFavBlogs.map((blog) => {
              blogsList.push(blog.blogId);
            });
          }
        }
      });
      setFavBlogsList(blogsList);
    };
    getUsersData();
  }, []);

  const handleAddToFav = (blog) => {
    let temp_boolean = false;
    users.map((checker) => {
      if (checker.userId === user.uid) {
        temp_boolean = true;
      }
    });
    if (temp_boolean === false) {
      console.log("You hav'nt created the profile!");
      navigate("/editProfile");
    } else {
      users.map(async (currUser) => {
        return currUser.userId === user.uid
          ? await updateDoc(doc(db, "users", currUser.id), {
              userAvatar: currUser.userAvatar,
              userName: currUser.userName,
              userBlogs: [...currUser.userBlogs],
              userEmail: currUser.userEmail,
              userCountry: currUser.userCountry,
              userStatus: currUser.userStatus,
              userFavBlogs: [...currUser.userFavBlogs, blog],
              userId: currUser.userId,
            })
          : "";
      });

      const getUsersData = async () => {
        const get = await getDocs(collection(db, "users"));
        setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        const temp_users = get.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const blogsList = [];
        temp_users.map((user) => {
          user.userFavBlogs.map((blog) => {
            blogsList.push(blog.blogId);
          });
        });
        setFavBlogsList(blogsList);
      };
      getUsersData();
    }
  };

  const letUsersLike = (blog) => {
    let temp_boolean = false;

    users.map((checker) => {
      if (checker.userId === user.uid) {
        temp_boolean = true;
      }
    });

    if (temp_boolean === false) {
      console.log("Navigate the user!");
      navigate("/editProfile");
    } else {
      handleLikes(blog);
    }
  };

  const handleLikes = async (blog) => {
    const getBlogsData = async () => {
      const get = await getDocs(collection(db, "blogs"));
      setBlogData(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    return (
      blog.Likes.length
        ? blog.Likes.map(async (likeByUser) => {
            if (likeByUser === user.uid) {
              await updateDoc(doc(db, "blogs", blog.id), {
                ...blog,
                Likes: blog.Likes.filter((checker) => {
                  return checker !== user.uid;
                }),
              });
            } else {
              await updateDoc(doc(db, "blogs", blog.id), {
                ...blog,
                Likes: [...blog.Likes, user.uid],
              });
            }
            getBlogsData();
          })
        : await updateDoc(doc(db, "blogs", blog.id), {
            ...blog,
            Likes: [...blog.Likes, user.uid],
          }),
      getBlogsData()
    );
  };

  const handleEdit = async (blog) => {
    await updateDoc(doc(db, "blogs", blog.id), {
      ...blog,
      edit: true,
    });
  };

  const handleDelete = (blog) => {
    const getUserData = async () => {
      const get = await getDocs(collection(db, "users"));
      const userData = get.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      userData.map(async (soloUser) => {
        return soloUser.userId === user.uid
          ? await updateDoc(doc(db, "users", soloUser.id), {
              ...soloUser,
              userBlogs: soloUser.userBlogs.filter((checker) => {
                return checker.blogId !== blog.blogId;
              }),
            })
          : soloUser;
      });
    };
    getUserData();
    deleteDoc(doc(db, "blogs", blog.id));
    const getData = async () => {
      const get = await getDocs(collection(db, "blogs"));
      setBlogData(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  };

  const [animationParent] = useAutoAnimate();

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleSearch = () => {
    setInput("");
    return blogData.map((blog) => {
      return blog.title.includes(input) ? setSearchResults([blog.blogId]) : "";
    });
  };

  const handleCreateBlog = () => {
    let temp_variable = false;
    users.map((checker) => {
      if (checker.userId === user.uid) {
        temp_variable = true;
      }
    });
    if (temp_variable === true) {
      navigate("/yourBlog");
    } else {
      navigate("/editProfile");
    }
  };
  return (
    <>
      <div className="header">
        <div className="goBack-container">
          {searchResults.length ? (
            <div style={{ display: "flex" }}>
              <BsArrowLeft
                className="goBackBtn"
                onClick={() => {
                  setSearchResults([]);
                }}
              />
              <span style={{ marginLeft: "0.25rem" }}>go back</span>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="SearchInputBtn-container">
          <input
            className="searchBlog"
            type="text"
            value={input}
            placeholder="Search here.."
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <div className="searchBtn-container">
            {input.length ? (
              <AiOutlineSearch
                className="searchBtn"
                onClick={() => {
                  handleSearch();
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {searchResults.length ? (
        <div>
          {searchResults &&
            searchResults.map((result) => {
              return blogData.map((blog) => {
                return blog.blogId === result ? (
                  <div className="searchBlog-window">
                    <div className="searchBlog-container">
                      <img
                        className="image"
                        src={blog.themeImg}
                        alt={blog.title}
                      />
                      <div className="userName-container">
                        <>
                          <div className="userAvatar-container">
                            <img
                              className="userAvatar"
                              src={
                                blog.userInfo.userAvatar === null
                                  ? "Assets/user.jpg"
                                  : blog.userInfo.userAvatar
                              }
                              alt="avatar"
                            />
                          </div>
                          <p className="userName">
                            <Link
                              to={{ pathname: "/profile", hash: "#singleUser" }}
                              style={{ textDecoration: "none", color: "black" }}
                              state={{
                                profileUser: {
                                  userId: blog.userInfo.userId,
                                  userEmail: blog.userInfo.userEmail,
                                },
                              }}
                            >
                              {blog.userInfo.userEmail}
                            </Link>
                          </p>
                          {favBlogsList.includes(blog.blogId) ? (
                            <AiFillHeart key={user.userId} className="favBtn" />
                          ) : (
                            <AiOutlineHeart
                              className="favBtn"
                              key={user.userId}
                              onClick={() => {
                                handleAddToFav(blog);
                              }}
                            />
                          )}
                        </>
                      </div>
                      <div className="title">
                        <p>{blog.title}</p>
                      </div>
                      <div className="content">
                        <p className="content-text">{blog.content}</p>
                      </div>
                      <div>
                        <Link
                          className="ReadMoreLink"
                          to="/singleBlog"
                          state={{ blog: blog }}
                        >
                          <p className="read-text">read more..</p>
                        </Link>
                      </div>
                      {user ? (
                        blog.userInfo.userId === user.uid ? (
                          <>
                            <div className="editBtn-container">
                              <Link to="/yourBlog" state={{ blog: blog }}>
                                <FaEdit
                                  color="black"
                                  className="editBtn"
                                  onClick={() => {
                                    handleEdit(blog);
                                  }}
                                >
                                  Edit
                                </FaEdit>
                              </Link>
                            </div>

                            <ImBin
                              onClick={() => {
                                handleDelete(blog);
                              }}
                              className="removeBtn-main"
                            />
                          </>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      <Link
                        to={{ pathname: "/chat", hash: "#shareBlog" }}
                        hash="#shareBlog"
                        state={{ blog: { blog } }}
                      >
                        <TbSend className="shareBtn" />
                      </Link>
                      <div className="likes-time-container">
                        <div className="likes">
                          {blog.Likes.includes(user ? user.uid : "") ? (
                            <FaThumbsUp
                              className="heart"
                              color="tomato"
                              onClick={(e) => {
                                letUsersLike(blog);
                              }}
                            />
                          ) : (
                            <FaRegThumbsUp
                              className=" heart heart-false"
                              onClick={(e) => {
                                letUsersLike(blog);
                              }}
                            />
                          )}

                          <p>{blog.Likes.length}</p>
                          <p>
                            {blog.Likes > 0 ? blog.Likes : ""}

                            {blog.Likes < 2 ? " like" : " likes"}
                          </p>
                        </div>
                        <p className="time">
                          {blog.timestamp.toDate().toDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                );
              });
            })}
        </div>
      ) : (
        <div className="blogs-container" ref={animationParent}>
          <div className="new-blog-container">
            {user ? (
              <h4 className="create-blogText">
                {" "}
                {`Hey! ${user.email} create your own blog (:`}
              </h4>
            ) : (
              ""
            )}
            <div className="btn-container">
              <button
                className="Add-btn"
                onClick={() => {
                  handleCreateBlog();
                }}
              >
                +
              </button>
            </div>
          </div>
          {blogData
            ? blogData.map((blog) => {
                return (
                  <>
                    <div className="blog-container" key={blog.id}>
                      <img
                        className="image"
                        src={blog.themeImg}
                        alt={blog.title}
                      />
                      <div className="userName-container">
                        <>
                          <div className="userAvatar-container">
                            <img
                              className="userAvatar"
                              src={
                                blog.userInfo.userAvatar === null
                                  ? "Assets/user.jpg"
                                  : blog.userInfo.userAvatar
                              }
                              alt="avatar"
                            />
                          </div>
                          <p className="userName">
                            <Link
                              to={{ pathname: "/profile", hash: "#singleUser" }}
                              style={{ textDecoration: "none", color: "black" }}
                              state={{
                                profileUser: {
                                  userId: blog.userInfo.userId,
                                  userEmail: blog.userInfo.userEmail,
                                },
                              }}
                            >
                              {blog.userInfo.userName
                                ? blog.userInfo.userName
                                : blog.userInfo.userEmail}
                            </Link>
                          </p>

                          {favBlogsList.includes(blog.blogId) ? (
                            <AiFillHeart
                              key={user.userId}
                              className="favBtn"
                              onClick={() => {
                                handleAddToFav(blog);
                              }}
                            />
                          ) : (
                            <AiOutlineHeart
                              className="favBtn"
                              key={user.userId}
                              onClick={() => {
                                handleAddToFav(blog);
                              }}
                            />
                          )}
                        </>
                      </div>
                      <div className="title">
                        <p>{blog.title}</p>
                      </div>
                      <div className="content">
                        <p className="content-text">{blog.content}</p>
                      </div>
                      <div>
                        <Link
                          className="ReadMoreLink"
                          to="/singleBlog"
                          state={{ blog: blog }}
                        >
                          <p className="read-text">read more..</p>
                        </Link>
                      </div>

                      {user ? (
                        blog.userInfo.userId === user.uid ? (
                          <>
                            <div className="editBtn-container">
                              <Link to="/yourBlog" state={{ blog: blog }}>
                                <FaEdit
                                  color="black"
                                  className="editBtn"
                                  onClick={() => {
                                    handleEdit(blog);
                                  }}
                                >
                                  Edit
                                </FaEdit>
                              </Link>
                            </div>

                            <ImBin
                              onClick={() => {
                                handleDelete(blog);
                              }}
                              className="removeBtn-main"
                            />
                          </>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      {users &&
                        users.map((soloUser) => {
                          return chats
                            ? chats.map((chatDoc) => {
                                return (soloUser.userId > user.uid
                                  ? soloUser.userId + user.uid
                                  : user.uid + soloUser.userId) ===
                                  chatDoc.id ? (
                                  <Link
                                    to={{
                                      pathname: "/chat",
                                      hash: "#shareBlog",
                                    }}
                                    hash="#shareBlog"
                                    state={{ blog: { blog } }}
                                  >
                                    <TbSend className="shareBtn" />
                                  </Link>
                                ) : (
                                  ""
                                );
                              })
                            : "";
                        })}

                      <div className="likes-time-container">
                        <div className="likes">
                          {blog.Likes.includes(user ? user.uid : "") ? (
                            <FaThumbsUp
                              className="heart"
                              onClick={() => {
                                letUsersLike(blog);
                              }}
                            />
                          ) : (
                            <FaRegThumbsUp
                              className=" heart"
                              onClick={() => {
                                letUsersLike(blog);
                              }}
                            />
                          )}

                          <p className="like-counter">{blog.Likes.length}</p>

                          <p>
                            {blog.Likes > 0 ? blog.Likes : ""}

                            {blog.Likes < 2 ? " like" : " likes"}
                          </p>
                        </div>
                        <p className="time">
                          {blog.timestamp.toDate().toDateString()}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })
            : ""}
        </div>
      )}
    </>
  );
};
export default Home;
