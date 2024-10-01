"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "users",
    });
    const [error, setError] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/validateCreds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ formData }),
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem("token", result.token);
                window.location.href = "/tasks";
            } else {
                setError(result.message);
                setFormData({
                    username: formData.username,
                    password: "",
                    role: "users",
                });
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value || "",
        }));
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch("/protected", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            role: "users",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            window.location.href = "/tasks";
                        } else {
                            handleLogout();
                        }
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Auth check error:", error);
                    setError("Auth check error:" + error);
                }
            }
        };

        checkAuth();
    }, []);

    return (
        <>
            <div className="container shadow-lg dark:shadow-md bg-card dark:bg-card rounded-lg">
                {error && <div className="alert alert-danger">{error}</div>}
                <form method="post" onSubmit={handleSubmit} className="form">
                    <div className="item">
                        <h1 className="text-2xl font-bold mb-4 text-center item">
                            Login
                        </h1>
                        <div className="floating-label">
                            <input
                                name="username"
                                id="username"
                                type="text"
                                className="input"
                                placeholder="username"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="username" className="float-label">
                                username
                            </label>
                        </div>
                    </div>
                    <div className="item">
                        <div className="floating-label">
                            <input
                                name="password"
                                type="password"
                                id="password"
                                className="input"
                                placeholder="password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                            <label htmlFor="password" className="float-label">
                                password
                            </label>
                        </div>
                    </div>
                    <div className="submit-div">
                        <Link href="/register">Not a user? Register</Link>
                        <button
                            type="submit"
                            className="submit-button shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
