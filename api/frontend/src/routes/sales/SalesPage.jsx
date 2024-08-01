import React, { useEffect, useState } from 'react';
import "./salesRoute.scss";
import { useLocation } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

const SalesRoute = () => {
  const { pathname } = useLocation();
  const [users, setUsers] = useState([]);
  const [postsCount, setPostsCount] = useState({});

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        const responseUsers = await apiRequest("/users");
        const responsePosts = await apiRequest("/posts");
        const userPostsCount = responseUsers.data.reduce((acc, user) => {
          acc[user.id] = responsePosts.data.filter((post) => post.userId === user.id).length;
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
    <div className='users'>
      <div className={`${pathname === "/sales" ? "before" : ""}`} />
      <div className='users-content'>
        <h1>Vendedores</h1>
        <div className='users-card-container'>
        {
          users.map((user) => (
            <div key={user._id} className='user-card'>
              <div className='user-img'>
                <img src={user.avatar ? user.avatar : "/noavatar.jpg"} alt={user.username} />
              </div>
              <div className='user-info'>
                <h2>{user.username}</h2>
                <p>Móveis anunciados: {postsCount[user.id] || 0}</p>
                <p>
                  <a href={`mailto:${user.email}`}> E-mail</a>
                </p>
              </div>
            </div>
          ))
        }
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
}

export default SalesRoute;
