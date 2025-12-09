import { createContext, useState, useEffect } from "react";
import api from "../apis/AxiosInstance";
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../types/auth';

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decodedUser = jwtDecode<MyJwtPayload>(token);

            const res = await api.get("/auth/me");
            setUser({
                ...res.data,
                isAdmin: decodedUser.isAdmin
            });
        } catch (err) {
            setUser(null);
            localStorage.removeItem("token");
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