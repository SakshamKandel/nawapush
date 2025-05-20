import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import NoAccess from "./NoAccess";
import { useNavigate, Link } from "react-router-dom";
import { contextCreate } from "../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [showPass, setshowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const adminLoggedIn = document.cookie.includes("adminToken");
  const studentLoggedIn = document.cookie.includes("studentToken");
  const contextUse = useContext(contextCreate);
  const navigate = useNavigate();
  
  const passHandleFunc = () => {
    setshowPass(!showPass);
  };
  
  const formBackendFunc = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/login", data, {
        withCredentials: true,
      });
      toast.success(response.data.alertMsg || "Logged in successfully!");
      contextUse.setName(response.data.name);
      if (response.data.email) {
        localStorage.setItem('email', response.data.email);
      }
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || "Login failed!");
      } else {
        toast.error(error.message || "Login failed!");
      }
    }
  };
  
  return !teacherLoggedIn && !adminLoggedIn && !studentLoggedIn ? (
    <div className="min-h-screen bg-[#f3f2ef] font-sans flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#0a66c2] tracking-tight mb-1.5">
            Nawa Tara
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            School Portal
          </h2>
          <p className="mt-4 text-xl text-gray-600 font-light">
            Stay updated with your school community
          </p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-8 shadow-md rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit(formBackendFunc)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email or Phone
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-base"
                  placeholder="Email or phone number"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="#" className="text-sm font-semibold text-[#0a66c2] hover:text-[#004182] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1.5 relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-base"
                  placeholder="Password"
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password cannot exceed 30 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                  onClick={passHandleFunc}
                  tabIndex="-1"
                >
                  <FontAwesomeIcon
                    icon={showPass ? faEyeSlash : faEye}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <span className="bg-white px-3 relative inline-block">
                Access is restricted to school staff only
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Nawa Tara English School ©️ {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  ) : (
    <NoAccess />
  );
};

export default LoginForm;