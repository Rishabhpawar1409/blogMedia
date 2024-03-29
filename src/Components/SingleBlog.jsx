import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./singleBlog.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
function SingleBlog() {
  const [users, setUsers] = useState();
  const location = useLocation();
  const { blog } = location.state;

  useEffect(() => {
    const getUsers = async () => {
      const get = await getDocs(collection(db, "users"));
      setUsers(get.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);
  return (
    <div className="singleBlog-page">
      <div className="singleBlogLike-conatiner">
        <p className="singleBlog-likeText">Likes</p>
        <div className="likes-container">
          {blog.Likes.map((personLiked) => {
            return (
              users &&
              users.map((user) => {
                return user.userId === personLiked ? (
                  <div className="userInfo-container" key={user.userId}>
                    <img
                      className="likeUserImg"
                      src={
                        user.userAvatar === null
                          ? "Assets/user.jpg"
                          : user.userAvatar
                      }
                      alt="avatar"
                    />
                    <p className="LikeUserName">{user.userName}</p>
                  </div>
                ) : (
                  ""
                );
              })
            );
          })}
        </div>
      </div>
      <div className="Singleblog-container">
        <img
          className="blog-image"
          src={blog.themeImg.image}
          alt="background of a blog"
        />
        <div className="blog-title">
          <p dangerouslySetInnerHTML={{ __html: blog.title }} />
        </div>
        <div className="blog-content">
          <p dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
      <div className="singleBlogComment-container">
        <p className="singleBlog-commentText">Comments</p>
      </div>
    </div>
  );
}
export default SingleBlog;
