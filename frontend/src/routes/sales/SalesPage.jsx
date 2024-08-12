import React, { useEffect, useState } from "react";
import "./salesRoute.scss";
import { useLocation } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

const SalesRoute = () => {
  const { pathname } = useLocation();
  const [users, setUsers] = useState([]);
  const [postsCount, setPostsCount] = useState({});

  
  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        const responseUsers = await apiRequest("/users");
        const responsePosts = await apiRequest("/posts");
        console.log(responsePosts.data);
        const userPostsCount = responseUsers.data.reduce((acc, user) => {
          acc[user.id] = responsePosts.data.filter(
            (post) => post.userId === user.id
          ).length;
          return acc;
        }, {});


        setUsers(responseUsers.data);
        setPostsCount(userPostsCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsersAndPosts();
  }, []);

  return (
    <div className="users">
      <div className="users-content">
        {
          users.map((user) => (
            <div key={user.id} className="card">
                <div className="banner">
                  <img className="img-banner" src={user.avatar || "/noavatar.jpg"} alt="" />
                </div>
                <div className="menu">
                  <div className="opener">
                  <span></span><span></span><span></span>
                  </div>
                </div>
                <h2 className="name">{user.username}</h2>
                <div className="title">
                 <a href={`mailto:${user.email}`}>
                <p>
                  {postsCount[user.id] || 0} Móveis à venda
                </p>
                  Email
                 </a>
                </div>
              </div>
          ))
        }
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
};

export default SalesRoute;
