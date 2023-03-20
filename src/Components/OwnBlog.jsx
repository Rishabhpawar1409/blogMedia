import React, { useEffect, useState } from "react";
import data from "../Context/data";
import "./ownBlog.css";
import { Link } from "react-router-dom";
import { FavroiteState } from "../Context/Context";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
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

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [index, setIndex] = useState(0);
  const [newimage, setnewImage] = useState("Assets/new6.png");
  const [edit, setEdit] = useState(false);
  const [currBlogs, setCurrBlogs] = useState("");
  const [users, setUsers] = useState();
  const { user } = useUserAuth();
  const [editBlog, setEditBlog] = useState("");

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
                setnewImage(blog.themeImg),
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
  const contentText = content.length < 50;

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(data.length - 1);
    } else {
      setIndex(nextIndex);
    }
  };

  const slideRight = () => {
    setIndex((index + 1) % data.length);
  };

  const handleSelect = () => {
    alert("Confirm background!!");
    setnewImage(data[index].image);
  };

  const handleSave = async () => {
    await updateDoc(doc(db, "blogs", editBlog.id), {
      ...editBlog,
      edit: false,
      title,
      content,
      themeImg: newimage,
    });

    users.map(async (soloUser) => {
      return soloUser.userId === user.uid
        ? await updateDoc(doc(db, "users", soloUser.id), {
            ...soloUser,
            userBlogs: [
              ...soloUser.userBlogs.map((checker) => {
                return checker.blogId === editBlog.blogId
                  ? { ...checker, title, content, themeImg: newimage }
                  : checker;
              }),
            ],
          })
        : soloUser;
    });
  };

  const handleCreateBlog = async () => {
    let avatar;
    users.map((checker) => {
      if (checker.userId === user.uid) {
        avatar = checker.userAvatar;
      }
    });
    let name;
    users.map((checker) => {
      if (checker.userId === user.uid) {
        name = checker.userName;
      }
    });

    await addDoc(collection(db, "blogs"), {
      title,
      blogId: id,
      content,
      Likes: [],
      comments: [],
      themeImg: newimage,
      timestamp: Timestamp.now(),
      edit: false,
      userInfo: {
        userId: user.uid,
        userEmail: user.email,
        userAvatar: avatar,
        userName: name,
      },
    });
    users.map(async (singleUser) => {
      return singleUser.userId === user.uid
        ? await updateDoc(doc(db, "users", singleUser.id), {
            userAvatar: singleUser.userAvatar,
            userName: singleUser.userName,
            userBlogs: [
              ...singleUser.userBlogs,
              {
                title,
                content,
                blogId: id,
                Likes: [],
                comments: [],
                themeImg: newimage,
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
  return (
    <>
      <div className="imageSlider-container">
        <div className="imageSlider">
          <GrPrevious className="previous-image" onClick={slideLeft} />
          <GrNext className="next-image" onClick={slideRight} />
          <p className="text-background">Choose background for your blog (:</p>
          <img
            className="imageSlider-image"
            src={data[index].image}
            alt={data[index].title}
          />
        </div>
      </div>
      <div className="apply-background-container">
        <button className="apply-background" onClick={handleSelect}>
          Select
        </button>
      </div>

      <div className="ownBlogInput-container">
        <div>
          <div className="title-container">
            <p className="myTitle">Title :</p>
            <input
              type="text"
              value={title}
              style={{
                backgroundImage: `url(${newimage})`,
              }}
              className="title-input"
              placeholder="Give title to your blog"
              onChange={handleTitle}
            />
          </div>
          <div className="content-container">
            <textarea
              className="textArea-input"
              value={content}
              placeholder="word limit(35-100)"
              maxLength="1000"
              style={{
                backgroundImage: `url(${newimage})`,
              }}
              onChange={handleContent}
            ></textarea>
          </div>
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
    </>
  );
}
export default OwnBlog;
