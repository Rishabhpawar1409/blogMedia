import React from "react";
import { MdLocationOn } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import { GiCoffeeCup } from "react-icons/gi";
import { Link } from "react-router-dom";

function Dummy() {
  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <img className="avatar" src="Assets/user.jpg" alt="Avatar" />
      </div>
      <p className="profile-name">Jon@gmail.com</p>
      <p className="profile-name">Jon Doe</p>
      <div className="profile-location-container">
        <MdLocationOn className="locationIcon" />
        <p>Mars ?</p>
      </div>
      <div className="profile-joiningDate">
        <BsCalendarEvent className="calendar" />
        <p> Joined on Aug 2022</p>
      </div>
      <div className="profile-status">
        <h4 className="status-text">Status:</h4>{" "}
        <p>
          Women
          <GiCoffeeCup color="brown" />
        </p>
      </div>
      <Link to="/editProfile">
        <button className="edit-btn">Edit</button>
      </Link>
    </div>
  );
}
export default Dummy;
