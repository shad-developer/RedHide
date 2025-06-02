import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../app/features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-8">Sign in to your account</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" name="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={handleInputChange} required />
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={handleInputChange} required />
              <div className="absolute right-4 top-11 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash className="w-5 h-5 text-gray-500" /> : <FaEye className="w-5 h-5 text-gray-500" />}
              </div>
            </div>

            <div className="flex justify-end text-sm mb-6">
              <NavLink to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</NavLink>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">Sign in</button>

            <div className="flex justify-center text-sm mb-6">
              <NavLink to="/signup" className="text-blue-600 hover:underline mt-5">Don’t have an account? Sign up</NavLink>
            </div>


          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
