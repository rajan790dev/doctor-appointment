import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [verifiedToken, setVerifiedToken] = useState(false);
  const [loading, setLoading] = useState(true); // for token verification
  const [token, setToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctor] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
const { pathname } = useLocation()
  // SignUp / Login
  const signUp = async (event, state, email, password, name) => {
    event.preventDefault();
    try {
      let user = { email, password };
      let url = backendUrl + "/api/user/login";

      if (state === "SignUp") {
        user = { email, password, name };
        url = backendUrl + "/api/user/register";
      }

      const { data } = await axios.post(url, user);

      if (data.success) {
        localStorage.setItem("aToken", data.token);
        setVerifiedToken(true);
        setToken(data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctors/list");
      if (data.success) {
        setDoctor(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // User Info
  const userInfo = async () => {

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/my-profile",
        {},
        { headers: {token}  }
      );

      if (data.success) {
        setCurrentUser(data.user);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Profile
  const editProfile = async (userData) => {
    const isValid = await verifyToken();
  if (!isValid) 
  {
      return ;
  }
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/edit-profile",
        userData,
        { headers: { token } }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Verify Token
  const verifyToken = async () => {
    try {
      await axios.post(
        backendUrl + "/api/user/token",
        {},
        { headers: { token: localStorage.getItem("aToken") } }
      );
      setVerifiedToken(true);
      return true;
    } catch (error) {
      console.error("Verify error:", error.response?.data || error.message);
      localStorage.removeItem("aToken");
      setToken("");
      setVerifiedToken(false);
      toast.error('Invalid User',{autoClose:2000})
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context Value
  const value = {
    doctors,
    token,
    setToken,
    signUp,
    currentUser,
    setCurrentUser,
    backendUrl,
    editProfile,
    verifiedToken,
    setVerifiedToken,
    loading,getAllDoctors,
    verifyToken
  };

  // Effects
  useEffect(() => {
    if (verifiedToken) {
      getAllDoctors();
      userInfo();
    }
  }, [verifiedToken]);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false); // no token means done
    }
  }, [token,pathname]);

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
