import React from "react";
import "./home.css";
import { ImBin } from "react-icons/im";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../Context/userAuthContext";
import { db } from "../firebase";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Favourite() {
  const { user } = useUserAuth();

  const [favBlogs, setFavBlogs] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const get = await getDocs(collection(db, "users"));
      const userData = get.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      userData.map((d) => {
        if (d.userId === user.uid) {
          return setFavBlogs(d.userFavBlogs);
        } else {
          return "";
        }
      });
    };

    getUserData();
  });

  const handleDeleteBlog = (blog) => {
    const getUserData = async () => {
      const get = await getDocs(collection(db, "users"));
      const userData = get.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      userData.map(async (soloUser) => {
        return soloUser.userId === user.uid
          ? await updateDoc(doc(db, "users", soloUser.id), {
              ...soloUser,
              userFavBlogs: soloUser.userFavBlogs.filter((checker) => {
                return checker.id !== blog.id;
              }),
            })
          : soloUser;
      });
    };
    getUserData();
  };

  const [animationParent] = useAutoAnimate();
  return (
    <>
      {favBlogs && favBlogs.length ? (
        <div className="blogs-container" ref={animationParent}>
          {favBlogs.map((blog) => {
            return (
              <div className="blog-container" key={blog.id}>
                <img
                  className="image"
                  src={blog.themeImg.image}
                  alt="background of a blog"
                />
                <div className="userName-container">
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
                  <p className="userName">{blog.userInfo.userName}</p>
                </div>
                <div className="title">
                  <p dangerouslySetInnerHTML={{ __html: blog.title }} />
                </div>
                <div className="content">
                  <p
                    className="content-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
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
                <ImBin
                  className="removeBtn"
                  onClick={() => {
                    handleDeleteBlog(blog);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="text-conatiner">
            <span style={{ fontSize: "20px", fontWeight: "bolder" }}>
              Oops ! Looks like there{" "}
            </span>
            <br></br>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bolder",
                marginLeft: "0.5rem",
              }}
            >
              {" "}
              is nothing in the favourite.
            </span>
          </div>
          <div className="exloreBtn-container">
            <Link to="/">
              <button className="explore-btn">Explore</button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
export default Favourite;
