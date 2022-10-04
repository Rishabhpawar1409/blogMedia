import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "../styles.css";
import Login from "./login";
import SignUp from "./signUp";
import ProtectedRoute from "./protectedRoute";
import Navbar from "./Navbar";
import Home from "./Home";
// import Favourite from "./Favourite";
import OwnBlog from "./OwnBlog";
import SingleBlog from "./SingleBlog";
import Profile from "./profile";
import EditProfile from "./editProfile";
import Chat from "./chat";
import { Routes, Route } from "react-router-dom";
const Favourite = React.lazy(() => import("./Favourite"));

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route exact path="/editProfile" element={<EditProfile />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signUp" element={<SignUp />} />

        <Route
          exact
          path="/favourite"
          element={
            <Suspense
              fallback={
                <div className="skeleton-window">
                  <div className="container-flex">
                    <div className="skeleton-container">
                      <Skeleton className="skeletonStyle-image" />
                      <Skeleton className="skeletonStyle-title" />
                      <div className="title-container">
                        <Skeleton className="skeletonStyle" count={4} />
                      </div>
                      <div className="actionConatiner">
                        <Skeleton className="Like" />
                        <Skeleton className="Share" />
                        <Skeleton className="Time" />
                      </div>
                    </div>

                    <div className="skeleton-container">
                      <Skeleton className="skeletonStyle-image" />
                      <Skeleton className="skeletonStyle-title" />
                      <div className="title-container">
                        <Skeleton className="skeletonStyle" count={4} />
                      </div>
                      <div className="actionConatiner">
                        <Skeleton className="Like" />
                        <Skeleton className="Share" />
                        <Skeleton className="Time" />
                      </div>
                    </div>

                    <div className="skeleton-container">
                      <Skeleton className="skeletonStyle-image" />
                      <Skeleton className="skeletonStyle-title" />
                      <div className="title-container">
                        <Skeleton className="skeletonStyle" count={4} />
                      </div>
                      <div className="actionConatiner">
                        <Skeleton className="Like" />
                        <Skeleton className="Share" />
                        <Skeleton className="Time" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <ProtectedRoute>
                <Favourite />
              </ProtectedRoute>
            </Suspense>
          }
        />

        <Route exact path="/chat" element={<Chat />} />
        <Route
          exact
          path="/yourBlog"
          element={
            <ProtectedRoute>
              <OwnBlog />
            </ProtectedRoute>
          }
        />
        <Route exact path="/singleBlog" element={<SingleBlog />} />
      </Routes>
    </div>
  );
}
