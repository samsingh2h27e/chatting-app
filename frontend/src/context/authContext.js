import { useState, useEffect, useContext, createContext } from "react";
///// need to add something for authentication and authorisation

const AuthContext = createContext();
const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        id : null,
        token : "", //// tset val
    });

    useEffect(()=>{
        const data = localStorage.getItem("auth");
        if (data){
            const parsedData = JSON.parse(data);
            setAuth({
                ...auth,
                id:parsedData.id,
                token:parsedData.token,
            });
        }
    }, []);


    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};


const useAuth = () => useContext(AuthContext);


export {useAuth, AuthProvider};