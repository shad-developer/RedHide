import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "keep-react";
import { RESET, signup } from "../../app/features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Signup = () => {
  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const { isSignupSuccess, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password should be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const userData = { username, email, password };

    await dispatch(signup(userData));

  };

  useEffect(() => {
    if (isSignupSuccess) {
      navigate("/verify-email", {
        state: {
          email: formData?.email,
        }
      }
      );
      dispatch(RESET());
    }
  }, [isSignupSuccess, navigate, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-8">Sign up to your account</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input type="text" name="username" placeholder="Full Name" className="w-full px-4 py-3 bg-gray-100 border rounded-lg" value={username} onChange={handleInputChange} required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input type="email" name="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-100 border rounded-lg" value={email} onChange={handleInputChange} required />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full px-4 py-3 bg-gray-100 border rounded-lg" value={password} onChange={handleInputChange} required />
            <div className="absolute right-4 top-11 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash  className="w-5 h-5 text-gray-500" /> : <FaEye className="w-5 h-5 text-gray-500" />}
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className="w-full px-4 py-3 bg-gray-100 border rounded-lg" value={confirmPassword} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 flex items-center justify-center text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700">
          {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> :"Sign Up"}
          </button>

          <div className="flex justify-center text-sm mt-5">
            <NavLink to="/" className="text-blue-600 hover:underline">Already have an account? Sign In</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
