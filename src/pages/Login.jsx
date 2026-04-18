import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from '../reducers/auth';

import "../styles/Auth.css";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const state = useSelector((reducer) => reducer.auth);

    React.useEffect(() => {
        if (localStorage.getItem("auth") === "true"  || state.auth) {
            navigate("/profile");
        }
    }, [navigate, state.auth]);

    //Check if checkbox term & condition is checked
    const checkTermCondition = () => {
        if (document.getElementById("terms-conditions").checked === false) {
            Swal.fire({
                title: "Term & Condition",
                text: "Please check term & condition first",
                icon: "error",
            });
        } else {
            handleLogin();
        }
    };

    const handleLogin = () => {

        // show loading before axios finish
        Swal.fire({
            title: "Please wait...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        axios
            .post(`${process.env.REACT_APP_BASE_URL}auth/login`, {
                email: email,
                password: password,
            })
            .then((result) => {
                Swal.fire({
                    title: "Login Success",
                    text: "Login success, redirect to app...",
                    icon: "success",
                }).then(() => {
                    console.log(result);
                    localStorage.setItem("auth", "true");
                    localStorage.setItem("userId", result?.data?.data?.user?.id);
                    localStorage.setItem("userFullName", result?.data?.data?.user?.fullname);
                    localStorage.setItem("userProfilePicture", result?.data?.data?.user?.profile_picture);
                    localStorage.setItem("token", result?.data?.data?.token);
                    dispatch(addAuth(result));
                    navigate("/profile");
                });
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    title: "Login Failed",
                    text: error?.response?.data?.message ?? "Something wrong in our app",
                    icon: "error",
                });
            });
    };


    return (
        <>
            {/* start of content */}
            <div className="container-fluid">
                <div className="row height-100">
                    <div className="col-md-6 px-0 left-side">
                        <div className="logo-container">
                            <img
                                src="/images/auth-logo.png"
                                style={{ width: "10vh", height: "14vh" }}
                                alt="Logo"
                            />
                        </div>
                        <div className="image-container">
                            <img
                                src="/images/auth-side-bg.png"
                                style={{ width: "100%", height: "100vh" }}
                                alt="Background"
                            />
                        </div>
                        <div className="overlay-box" />
                    </div>
                    <div className="auth-form col p-4 d-flex flex-column justify-content-center m-0">
                        <h1 className="text-center">Welcome</h1>
                        <p className="text-center">
                            Log in into your exiting account
                        </p>
                        <div className="row m-0 p-0 justify-content-start align-items-center justify-content-md-center">
                            <div className="col col-md-8">
                                <hr />
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                    }}>
                                    <div className="mb-3">
                                        <label for="email" className="form-label">
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="E-mail"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label for="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="terms-conditions"
                                            name="terms-conditions"
                                        />
                                        <label className="form-check-label" for="termsConditions">
                                            I agree to terms & conditions
                                        </label>
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className=""
                                            style={{ backgroundColor: "#7FDA89", color: "white" }}
                                            onClick={checkTermCondition}
                                        >
                                            Log in
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <p className="text-center mt-5">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="text-decoration-none"
                                style={{ color: "#259073" }}
                            >
                                {" "}
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* end of content */}
        </>

    )
}
