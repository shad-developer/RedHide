import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.css";
import { ToastWrapper } from "keep-react";
import axios from "axios";

import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utils/protectedRoutes";
import Login from "./pages/auth/Login";
import Signup from './pages/auth/Signup';
import Loader from "./components/common/Loader";
import Home from "./pages/Home";
import EmailVerify from "./pages/auth/EmailVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Animals from "./pages/Animals";
import Feeds from "./pages/Feeds";
import FeedStock from "./pages/FeedStock";
import Flock from "./pages/Flock";
import NotFound from "./pages/NotFound";
import FeedHistory from "./pages/FeedHistory";
import MyProfile from "./pages/MyProfile";
import Meditation from "./pages/Meditation";
import MedicineHistory from "./pages/MedicineHistory";


axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <>
      <ToastWrapper
        richColors={true}
        toastOptions={{
          classNames: {
            title: 'text-md font-medium',
            toast: 'rounded-sm shadow-large',
            description: 'text-md font-normal',
          },
        }}
      />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/medicine-history/:flockName" element={<MedicineHistory />} />
            <Route path="/feed-stock" element={<FeedStock />} />
            <Route path="/feed-history/:feedName" element={<FeedHistory />} />
            <Route path="/flock" element={<Flock />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>


          {/* public routes */}
          <Route path="/" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/verify-email" exact element={<EmailVerify />} />
          <Route path="/forgot-password" exact element={<ForgotPassword />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
