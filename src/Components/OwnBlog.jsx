import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import data from "../Context/data";
import "./ownBlog.css";
import uuid from "react-uuid";
import { useUserAuth } from "../Context/userAuthContext";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  Timestamp,
  getDocs,
} from "firebase/firestore";

function OwnBlog() {
  const id = uuid();
  const randomTheme = data[Math.floor(Math.random() * data.length)];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newimage, setnewImage] = useState("Assets/new6.png");
  const [edit, setEdit] = useState(false);
  const [currBlogs, setCurrBlogs] = useState("");
  const [users, setUsers] = useState();
  const { user } = useUserAuth();
  const [editBlog, setEditBlog] = useState("");
  const [selectedTheme, setSelectedTheme] = useState({
    id: randomTheme.id,
    image: randomTheme.image,
  });

  useEffect(() => {
    getUserData();
    getBlogsData();
  }, []);

  useEffect(() => {
    const setData = () => {
      return currBlogs
        ? currBlogs.map((blog) => {
            return blog.edit === true
              ? (setTitle(blog.title),
                setContent(blog.content),
                setSelectedTheme(blog.themeImg),
                // setnewImage(blog.themeImg),
                setEdit(true),
                setEditBlog(blog),
                updateDoc(doc(db, "blogs", blog.id), {
                  ...blog,
                  edit: false,
                }))
              : blog;
          })
        : "";
    };
    setData();
  }, [currBlogs]);

  const getBlogsData = async () => {
    const get = await getDocs(collection(db, "blogs"));
    setCurrBlogs(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const getUserData = async () => {
    const get = await getDocs(collection(db, "users"));
    setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContent = (e) => {
    setContent(e.target.value);
  };
  const titleText = title.length === 0;
  const contentText = content.length < 300;

  const handleSave = async () => {
    console.log(selectedTheme.image);
    await updateDoc(doc(db, "blogs", editBlog.id), {
      ...editBlog,
      edit: false,
      title,
      content,
      themeImg: selectedTheme,
    });

    users &&
      users.map(async (soloUser) => {
        return soloUser.userId === user.uid
          ? await updateDoc(doc(db, "users", soloUser.id), {
              ...soloUser,
              userBlogs: [
                ...soloUser.userBlogs.map((checker) => {
                  return checker.blogId === editBlog.blogId
                    ? {
                        ...checker,
                        title,
                        content,
                        themeImg: selectedTheme,
                      }
                    : checker;
                }),
              ],
            })
          : soloUser;
      });
  };

  const handleCreateBlog = async () => {
    let avatar;
    users &&
      users.map((checker) => {
        if (checker.userId === user.uid) {
          avatar = checker.userAvatar;
        }
      });
    let name;
    users &&
      users.map((checker) => {
        if (checker.userId === user.uid) {
          name = checker.userName;
        }
      });

    await addDoc(collection(db, "blogs"), {
      // title,
      title,
      blogId: id,
      // content,
      content,
      Likes: [],
      comments: [],
      themeImg: selectedTheme,
      timestamp: Timestamp.now(),
      edit: false,
      userInfo: {
        userId: user.uid,
        userEmail: user.email,
        userAvatar: avatar,
        userName: name,
      },
    });
    users &&
      users.map(async (singleUser) => {
        return singleUser.userId === user.uid
          ? await updateDoc(doc(db, "users", singleUser.id), {
              userAvatar: singleUser.userAvatar,
              userName: singleUser.userName,
              userBlogs: [
                ...singleUser.userBlogs,
                {
                  // title,
                  title,
                  content,
                  blogId: id,
                  Likes: [],
                  comments: [],
                  themeImg: selectedTheme,
                },
              ],
              userEmail: singleUser.userEmail,
              userCountry: singleUser.userCountry,
              userStatus: singleUser.userStatus,
              userFavBlogs: [...singleUser.userFavBlogs],
              userId: singleUser.userId,
            })
          : "";
      });
  };

  const handleSelectImage = (theme) => {
    setSelectedTheme({ id: theme.id, image: theme.image });
  };
  return (
    <div className="ownBlog-window">
      <div className="first-container">
        <div className="theme-container">
          {data &&
            data.map((theme, index) => {
              return selectedTheme.id === theme.id ? (
                // Theme that is selected!
                <div
                  className="theme"
                  key={index}
                  style={index % 2 !== 0 ? { marginRight: "5px" } : {}}
                >
                  <div className="first-child-container">
                    <img
                      loading="lazy"
                      style={{
                        height: "100%",
                        width: "100%",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                      src={theme.image}
                      alt={`theme-${index}`}
                      onClick={() => {
                        handleSelectImage(theme);
                      }}
                    />
                  </div>
                  <div className="showSelected">
                    <span>Selected!</span>
                  </div>
                </div>
              ) : (
                <div
                  className="theme"
                  key={index}
                  style={index % 2 !== 0 ? { marginRight: "5px" } : {}}
                >
                  <img
                    loading="lazy"
                    className="theme-image"
                    src={theme.image}
                    alt={`theme-${index}`}
                    onClick={() => {
                      handleSelectImage(theme);
                    }}
                  />
                </div>
              );
            })}
        </div>
        <div>
          <p
            style={{
              color: "#E96479",
              marginTop: "0.15rem",
              fontWeight: "bold",
            }}
          >
            Choose theme!
          </p>
          {edit === true ? (
            <div className="createBtn-container">
              <Link to="/">
                <button
                  className="createBlog"
                  disabled={titleText || contentText}
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </button>
              </Link>
            </div>
          ) : (
            <div className="createBtn-container">
              <Link to="/">
                <button
                  disabled={titleText || contentText}
                  className="createBlog"
                  onClick={() => {
                    handleCreateBlog();
                  }}
                >
                  Create
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="second-container">
        <div className="selected-theme-container">
          <div className="selctedTheme-container">
            <img
              className="theme-image"
              src={selectedTheme.image}
              alt="selected image."
              style={{ cursor: "default" }}
            />
          </div>
        </div>
        <div className="text-editor-container">
          <ReactQuill
            theme="snow"
            placeholder="Give title to your blog"
            value={title}
            onChange={setTitle}
            className="editor-box-forTitle"
          />
          <ReactQuill
            theme="snow"
            placeholder="Enter text here... min char(300)"
            value={content}
            onChange={setContent}
            className="editor-box-forContent"
          />
        </div>
      </div>
    </div>
    // <>
    //   <div className="imageSlider-container">
    //     <div className="imageSlider">
    //       <GrPrevious className="previous-image" onClick={slideLeft} />
    //       <GrNext className="next-image" onClick={slideRight} />
    //       <p className="text-background">Choose background for your blog (:</p>
    //       <img
    //         className="imageSlider-image"
    //         src={data[index].image}
    //         alt={data[index].title}
    //       />
    //     </div>
    //   </div>
    //   <div className="apply-background-container">
    //     <button className="apply-background" onClick={handleSelect}>
    //       Select
    //     </button>
    //   </div>

    //   <div className="ownBlogInput-container">
    //     <div>
    //       <div className="title-container">
    //         <p className="myTitle">Title :</p>
    //         <input
    //           type="text"
    //           value={title}
    //           style={{
    //             backgroundImage: `url(${newimage})`,
    //           }}
    //           className="title-input"
    //           placeholder="Give title to your blog"
    //           onChange={handleTitle}
    //         />
    //       </div>
    //       <div className="content-container">
    //         <textarea
    //           className="textArea-input"
    //           value={content}
    //           placeholder="word limit(35-100)"
    //           maxLength="1000"
    //           style={{
    //             backgroundImage: `url(${newimage})`,
    //           }}
    //           onChange={handleContent}
    //         ></textarea>
    //       </div>
    //       {edit === true ? (
    //         <div className="createBtn-container">
    //           <Link to="/">
    //             <button
    //               className="createBlog"
    //               disabled={titleText || contentText}
    //               onClick={() => {
    //                 handleSave();
    //               }}
    //             >
    //               Save
    //             </button>
    //           </Link>
    //         </div>
    //       ) : (
    //         <div className="createBtn-container">
    //           <Link to="/">
    //             <button
    //               disabled={titleText || contentText}
    //               className="createBlog"
    //               onClick={() => {
    //                 handleCreateBlog();
    //               }}
    //             >
    //               Create
    //             </button>
    //           </Link>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </>
  );
}
export default OwnBlog;
