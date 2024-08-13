import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

const SECRET_KEY = "secret_key";

const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Função para atualizar o usuário e o localStorage
    const updateUser = (data) => {
        const expirationTime = Date.now() + 100 * 60 * 60 * 1000; // 100 horas em milissegundos
        const userWithExpiry = { ...data, expiryTimestamp: expirationTime };
        const encryptedUser = encrypt(userWithExpiry);
        if (!data) {
            localStorage.removeItem("user");
            setCurrentUser(null);
            return;
        }
        localStorage.setItem("user", encryptedUser);
        setCurrentUser(userWithExpiry);
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const decryptedUser = decrypt(savedUser);
                // Verifica se o usuário ainda é válido
                if (decryptedUser && Date.now() <= decryptedUser.expiryTimestamp) {
                    setCurrentUser(decryptedUser);
                } else {
                    localStorage.removeItem("user");
                }
            } catch (error) {
                console.error("Error decrypting user data:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const checkExpiry = () => {
                const savedUser = localStorage.getItem("user");
                if (savedUser) {
                    try {
                        const decryptedUser = decrypt(savedUser);
                        if (Date.now() > decryptedUser.expiryTimestamp) {
                            localStorage.removeItem("user");
                            setCurrentUser(null);
                        }
                    } catch (error) {
                        console.error("Error decrypting user data:", error);
                        localStorage.removeItem("user");
                        setCurrentUser(null);
                    }
                }
            };
            const intervalId = setInterval(checkExpiry, 60000); // Checa a cada 1 minuto
            return () => clearInterval(intervalId);
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
