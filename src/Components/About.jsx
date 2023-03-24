import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="about-window">
      <div className="about-section">
        <p>
          Welcome to <b>BlogMedia</b>, the ultimate platform for bloggers and
          avid readers! This platform is designed to provide entertainment and
          knowledge to users with a passion for writing and reading. I believe
          in empowering users to share their experiences and insights with the
          world through the art of blogging.
        </p>
        <br></br>
        <p>
          As the developer of BlogMedia, I am passionate about creating
          intuitive and user-friendly platforms that make it easy for people to
          connect and share their stories. With BlogMedia, I wanted to create a
          platform that enables bloggers to create and share content with ease,
          while also providing readers with a seamless and immersive experience.
        </p>
        <br></br>
        <p>
          This platform includes a robust login and signup system that ensures
          your information is safe and secure. Once you sign up, you can create
          a complete profile that showcases your personality and writing style.
          It's user-friendly interface makes it easy to perform actions like
          creating, editing, and publishing blog posts, following other
          bloggers, and engaging with other users.
        </p>
        <br></br>
        <p>
          At BlogMedia, I take pride in offering a range of unique features that
          make this platform stand out from the crowd. This platform offers a
          complete CRUD (Create, Read, Update, Delete) system that enables users
          to manage their blogs with ease. Users can also like, comment, and
          share other users' blog posts, as well as add blogs to their
          favourites for quick access. It's messaging feature allows users to
          communicate with each other, follow other users, and share blogs via
          chat. I have also added unique features like the ability to customize
          the background theme of your blog and a double tick seen/unseen
          message system that indicates when a message has been read.
        </p>
        <br></br>
        <p>
          Overall, BlogMedia is a user-friendly and intuitive platform that
          enables bloggers to connect and share their stories with the world. I
          invite you to join our community and start sharing your experiences
          with like-minded individuals today!
        </p>
        <br></br>
        <p>
          *Note: without creating your profile you can not access some of the
          features like :
        </p>
        <br></br>
        <span>
          - you canot like the blog, you will be redirected to the profile page.
        </span>
        <br></br>
        <span>
          - you cannot add blog to the favourite blog list , you will be
          redirected to the profile page.
        </span>
        <br></br>
        <span>
          - you won't be able to see the follow or message button on other users
          profile page.
        </span>
        <br></br>
        <span>
          - you wont't be able to create your own blog, you will be redirected
          to the peofile page.
        </span>
      </div>
    </div>
  );
};
export default About;
