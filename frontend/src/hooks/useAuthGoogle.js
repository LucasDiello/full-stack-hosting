import React, { useContext, useState } from 'react'
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiRequest, { setAuthToken } from '../lib/apiRequest';

export const useAuthGoogle = (setError) => {
    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const loginGoogle = useGoogleLogin({
        
        onSuccess: async (codeResponse) => {
            console.log(codeResponse)
          const res = axios
            .get(
              `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
            )
            .then(({ data }) => {
              apiRequest
              .post(
                "/auth/google-login",
                {
                    data
                },
                {
                  credentials: "include",
                }
              )
              .then((result) => {
                const data = result.data;
    
                localStorage.setItem("token", data.token);
    
                updateUser(data);
                setAuthToken(data.token);
                navigate("/");
                })
                .catch((err) => {
                    console.log(err.response.data.message)
                setError(err.response.data.message);

                });
            })
            .catch((err) => {
                console.log(err)
                setError("Failed to authenticate with Google");
            });
        },
        onError: async (error) => {
            console.log(error)
            setError("Failed to authenticate with Google");
        },
      });
    
    return { loginGoogle }
}


