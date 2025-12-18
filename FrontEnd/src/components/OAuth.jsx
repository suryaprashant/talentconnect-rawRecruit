// src/components/OAuth.jsx
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { toast } from "react-toastify";

const OAuth = ({ userType }) => {
  const { setToken, setUser, setShowLogin } = useContext(AppContext);

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        setShowLogin(false);
        toast.success("Login successful!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Could not sign in with Google:", error);
      toast.error("Google sign-in failed");
    }
  };

  const handleLinkedInClick = (e) => {
    e.preventDefault();
    if (!userType) {
      return toast.error("Please select your user type before LinkedIn signup.");
    }
    const url = `${import.meta.env.VITE_Backend_URL}/api/auth/linkedin?userType=${encodeURIComponent(
      userType
    )}`;
    window.location.href = url; // or window.open(url, '_self')
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleGoogleClick} className="btn btn-outline w-full">
        Continue with Google
      </button>
      <button onClick={handleLinkedInClick} className="btn btn-outline w-full">
        Continue with LinkedIn
      </button>
    </div>
  );
};

export default OAuth;
