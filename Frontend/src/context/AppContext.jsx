/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [credit, setCredit] = useState(false);

  const backenUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backenUrl}/api/user/credits`, {
        headers: { token },
      });

      // console.log(data);

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message);
    }
  };

  const generateImage = async (prompt) => {
    try {
      // console.log(prompt);

      const { data } = await axios.post(
        `${backenUrl}/api/image/generateimage`,
        {
          prompt,
        },
        { headers: { token } }
      );

      console.log(data);

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      }
      //  else if (data.success === false && data.creditBalance === 0) {
      //   console.log(data.message);
      //   toast.error(data.message);
      //   loadCreditsData();
      //   if (data.creditBalance === 0) {
      //     navigate("/buy-credit");
      //   }
      // }
    } catch (error) {
      // toast.error(error.message);
      if (error.response && error.response.status === 406) {
        const { message, creditBalance } = error.response.data;
        toast.error(message);

        // Update credit balance and navigate
        setCredit(creditBalance);
        if (creditBalance === 0) {
          navigate("/buy-credit");
        }
      } else {
        // Handle other errors
        toast.error(error.message || "An unexpected error occurred.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backenUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
