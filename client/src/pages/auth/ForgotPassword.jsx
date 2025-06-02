import React, { useEffect, useState } from "react";
import { toast } from "keep-react";
import { useNavigate } from "react-router-dom";
import { RESET, resetPassword, sendOTPForgotPassword } from "../../app/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {

  const { user, isSuccess, isLoading, isPasswordResetSuccess } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user?.email || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  
  

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    await dispatch(sendOTPForgotPassword({email}));
  };


  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (newCode[index] === "") {
        // If current is already empty, move to previous
        if (index > 0) {
          newCode[index - 1] = "";
          document.getElementById(`input-${index - 1}`).focus();
        }
      } else {
        // Clear the current box
        newCode[index] = "";
      }
      setCode(newCode);
    }
  };



  const handleResetPassword = async () => {
    if (!email || code.some((c) => c === "") || !newPassword) {
      toast.error("All Fields Are Required");
      return;
    }

    const otp = code.join("");

    const data = {
      email, otp, newPassword
    }

    await dispatch(resetPassword(data));
  };

  useEffect(() => {
    if (isPasswordResetSuccess) {
      navigate("/dashboard");
      dispatch(RESET());
    }
  }, [isPasswordResetSuccess, navigate, dispatch]);

  return (
    <>
      <div className="flex items-center justify-center mt-24 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
            Forgot Your Password?
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address below and we'll send you a OTP to reset
            your password.
          </p>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full h-12 px-4 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex justify-end w-ful">
              <button onClick={handleSendOTP} className="cursor-pointer mt-2 text-md text-blue-600 ">
                {isLoading ? "Sending" :"Send OTP"}</button></div>
          </div>
          

          {/* OTP Write here */}
          <div className="flex justify-center mb-4 space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  className="w-12 h-12 text-center border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              ))}
            </div>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 border border-indigo-500 rounded px-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="New Password"
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </span>
            </div>
          <button
            onClick={handleResetPassword}
              type="submit"
              className={`w-full py-2 text-white rounded transition duration-300 bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
            Reset Password
            </button>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
