import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { useUserAuth } from "../Context/userAuthContext";
import "./skeleton.css";

function SkeletonRender() {
  const [favBlogs, setFavBlogs] = useState([]);
  const { user } = useUserAuth();

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
  return (
    <div className="skeleton-container">
      <div className="soloSkeleton">
        <Skeleton className="skeletonStyle" count={5} />
      </div>
      <div className="soloSkeleton">
        <Skeleton className="skeletonStyle" count={5} />
      </div>
      <div className="soloSkeleton">
        <Skeleton className="skeletonStyle" count={5} />
      </div>
    </div>
  );
}
export default SkeletonRender;
