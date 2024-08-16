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
        console.log("User updated");
        setCurrentUser(userWithExpiry);
    };

    const checkUserExpiry = () => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            removeAuthUser();
            setCurrentUser(null);
            return;
        }

        const decryptedUser = decrypt(savedUser);
        if (decryptedUser && Date.now() <= decryptedUser.expiryTimestamp) {
            setCurrentUser(decryptedUser);
        } else {
            removeAuthUser();
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        checkUserExpiry(); // Check user on initial load
        const intervalId = setInterval(checkUserExpiry, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
