import axios from "axios";
import apiRequest, { setAuthToken } from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const client_id_github = import.meta.env.VITE_GITHUB_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
const client_id_facebook = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const secret_id_facebook = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export const loginFacebook = () => {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${client_id_facebook}&redirect_uri=${redirect_uri}&scope=email`;
  window.location.assign(url);
};

export const fetchFacebookToken = async (code) => {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${client_id_facebook}&client_secret=${secret_id_facebook}&code=${code}&redirect_uri=${redirect_uri}`
    );
    return data.access_token;
  } catch (err) {
    throw new Error("Erro ao autenticar com o Facebook.");
  }
};

export const fetchFacebookProfile = async (accessToken) => {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture.data.url,
      verified_email: true,
    };
  } catch (err) {
    throw new Error("Erro ao obter informações do perfil do Facebook.");
  }
};

export const useAuthFace =  () => {

    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const authLoginFacebook  = async  () => {
        
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        
        if (code) {
            
            try {
                const accessToken = await fetchFacebookToken(code);
                const profile = await fetchFacebookProfile(accessToken);

                const { data: dataProfile } = await apiRequest.post(
                    "/auth/google-login",
                    { data: profile },
                    { credentials: "include" }
                );
                
                localStorage.setItem("token", dataProfile.token);
                setAuthToken(dataProfile.token);
                updateUser(dataProfile);
                navigate("/");
            } catch (err) {
                throw new Error(err.message);
            }
        }
    }

    return {authLoginFacebook}
};




export const loginGithub = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id_github}&redirect_uri=${redirect_uri}&scope=user`;
    window.location.assign(url);
  };

  export const fetchGithubToken = async (code) => {
    try {
      const { data } = await apiRequest.post('/auth/github/access-token', { code });
      return data.access_token;
    } catch (err) {
      throw new Error("Erro ao autenticar com o GitHub.");
    }
  };
  

  
  export const fetchGithubProfile = async (accessToken) => {
    try {
      const { data } = await axios.get(`https://api.github.com/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const emails = await axios.get(`https://api.github.com/user/emails`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const email = emails.data.find((e => e.primary)).email
      return {
        id: data.id,
        name: data.name,
        email: email,
        picture: data.avatar_url,
        verified_email: true,
      };
    } catch (err) {
      throw new Error("Erro ao obter informações do perfil do GitHub.");
    }
  };
  
  export const useAuthGithub = () => {
    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const authLoginGithub = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        try {
          const accessToken = await fetchGithubToken(code);
          const profile = await fetchGithubProfile(accessToken);

          const { data: dataProfile } = await apiRequest.post(
            "/auth/google-login",  
            { data: profile },
            { credentials: "include" }
          );
  
          localStorage.setItem("token", dataProfile.token);
          setAuthToken(dataProfile.token);
          updateUser(dataProfile);
          navigate("/");
        } catch (err) {
          throw new Error(err.message);
        }
      }
    };

    return { authLoginGithub };
  };
  