import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { createContext, useEffect, useState } from "react";
import { Spin } from "antd";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({ displayName, email, uid, photoURL });
                setIsLoading(false);
                navigateTo("/");
                return;
            }
            setIsLoading(false);
            navigateTo("/login");
        });

        //clean function
        return () => {
            unsubscribe();
        };
    }, [navigateTo]);

    return <AuthContext.Provider value={{ user }}>{isLoading ? <Spin /> : children}</AuthContext.Provider>;
}

export default AuthProvider;
