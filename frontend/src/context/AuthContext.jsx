import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { removeAuthUser } from "../lib/apiRequest";

export const AuthContext = createContext();
const SECRET_KEY = "secret_key";

const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Error decrypting data:", error);
        return null;
    }
};

const TOKEN_EXPIRY_TIME = 100 * 60 * 60 * 1000; // 100 hours in milliseconds

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("user") || null); ;
    const [chats, setChats] = useState(false);
    
    const updateUser = (data) => {
        if (!data) {
            removeAuthUser();
            setCurrentUser(null);
            console.log("User removed");
            return;
        }
        
        const expirationTime = Date.now() + TOKEN_EXPIRY_TIME;
        const userWithExpiry = { ...data, expiryTimestamp: expirationTime };
        const encryptedUser = encrypt(userWithExpiry);
        
        localStorage.setItem("user", encryptedUser);
        setCurrentUser(userWithExpiry);
    };
    
    const checkUserExpiry = () => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            console.log("No user found");
            removeAuthUser();
            setCurrentUser(null);
            return;
        }

        const decryptedUser = decrypt(savedUser);
        if (decryptedUser && Date.now() <= decryptedUser.expiryTimestamp) {
            console.log("User still valid");
            setCurrentUser(decryptedUser);
        } else {
            console.log("User expired");
            removeAuthUser();
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        checkUserExpiry(); // Check user on initial load
        const intervalId = setInterval(checkUserExpiry, 1000000); // Check every 10 minute
        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser, chats, setChats }}>
            {children}
        </AuthContext.Provider>
    );
};
