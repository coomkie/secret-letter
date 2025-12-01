import { createContext, useState, useEffect } from "react";
import api from "../apis/AxiosInstance";

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (err) {
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, reloadUser: loadUser }}>
            {children}
        </UserContext.Provider>
    );
};
