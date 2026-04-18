import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router";
import axios from 'axios';
// import components
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'


import '../styles/Detail.css'

export default function Detail() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const pathname = location?.pathname;

    useEffect(() => {
        const currentSlug = pathname?.split("/")[2];

        window.scrollTo(0, 0);

        // Fetch current recipe using axios
        axios.get(`${process.env.REACT_APP_BASE_URL}recipe/detail/${currentSlug}`)
            .then((result) => {
                setCurrentRecipe(result.data?.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [pathname]);

    const RecipeIngredients = () => {
        const ingredientsResponse = currentRecipe?.ingredients;
        const lines = ingredientsResponse ? ingredientsResponse.split("-").slice(1) : [];

        return (
            <div>
                <ul>
                    {lines.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>
        );

    };

    return (
        <>
            <Navbar />
            {
                isLoading ? (
                    <section id="content">
                        <div className="container">
                            <h1 className="text-center text-primary">&nbsp;</h1>
                            <div className="d-flex justify-content-center">
                                <img src="&nbsp;" className="main-image" alt="Loading" />
                            </div>
                            <div className="row mt-5">
                                <div className="col offset-md-2">
                                    <h2>&nbsp;</h2>
                                    <RecipeIngredients />
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section id="content">
                        <div className="container">
                            <h1 className="text-center text-primary">{currentRecipe?.title}</h1>
                            <div className="d-flex justify-content-center" style={{ position: 'relative' }}>
                                <img src={`${currentRecipe?.recipe_picture}`} className="main-image" alt={currentRecipe?.title || "Recipe"} />
                            
                            </div>
                            <div className="row mt-5">
                                <div className="col offset-md-2">
                                    <h2>Ingredients</h2>
                                    <RecipeIngredients />
                                </div>
                            </div>
                        

                        </div>
                    </section>
                )
            }
            {/* start of content */}

            {/* end of content */}
            <Footer />
        </>

    )
}
