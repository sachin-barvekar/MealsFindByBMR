import React, { useState, useEffect } from 'react'

// import styles
import '../styles/Profile.css'

// import components
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null)
    const fullName = localStorage.getItem("userFullName");
    const profilePicture = localStorage.getItem("userProfilePicture");

    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            navigate("/login");
        }
    }, [navigate]);

    // Set user profile data from local storage
    useEffect(() => {
        const profileData = {
            fullname: localStorage.getItem("userFullName"),
            profile_picture: localStorage.getItem("userProfilePicture"),
        };

        // Check if profile data is empty and use axios instead
        if (!profileData.fullname && !profileData.profile_picture) {
            console.log(profileData.fullname, profileData.profile_picture);
            axios.get(`${process.env.REACT_APP_BASE_URL}profile`).then((result) => {
                setProfile(result.data?.data[0]);
            });
        } else {
            setProfile(profileData);
        }
    }, [fullName, profilePicture]);

    return (
        <>
            <Navbar />
            {/* start of user profile */}
            <div className="container mb-4">
                <div className="d-flex justify-content-center mt-2">
                    <img
                        src={profile?.profile_picture}
                        className="rounded-circle"
                        alt="Cinque Terre"
                        width={150}
                        height={150}
                    />
                </div>
                <div className="mt-3 d-flex justify-content-center">
                    <h3 className="text-center text-primary">{profile?.fullname}</h3>
                </div>
            </div>
            {/* end of user profile  */}
           
            <Footer />
        </>
    )
}
