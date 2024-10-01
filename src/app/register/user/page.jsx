"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const UserRegistration = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male",
        role: "users",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        if (formData.confirmPassword === formData.password) {
            e.preventDefault();
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                console.log("Registration successful");
                window.location.href = "/auth/login";
            } else {
                console.log("Registration failed try again");
            }
        }
    };

    useEffect(() => {
        if (
            formData.confirmPassword &&
            formData.confirmPassword !== formData.password
        ) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    }, [formData.confirmPassword]);

    return (
        <div className="container">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="form">
                <h1 className="text-2xl font-bold mb-4 text-center item">
                    User
                </h1>
                <div className="item floating-label">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="input"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="username" className="float-label">
                        Username
                    </label>
                </div>
                <div className="item floating-label">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="email" className="float-label">
                        Email
                    </label>
                </div>
                <div className="item floating-label">
                    <select
                        id="gender"
                        name="gender"
                        className="input"
                        placeholder="Gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <label htmlFor="gender" className="float-label">
                        Gender
                    </label>
                </div>
                <div className="item floating-label">
                    <input
                        type="organisation"
                        id="organisation"
                        name="organisation"
                        className="input"
                        placeholder="Organisation(Optional)"
                        value={formData.organisation}
                        onChange={handleChange}
                    />
                    <label htmlFor="organisation" className="float-label">
                        Organisation(Optional) (request will be sent to the
                        admins)
                    </label>
                </div>
                <div className="item floating-label">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="input"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password" className="float-label">
                        Password
                    </label>
                </div>
                <div className="item floating-label">
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="input"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="confirmPassword" className="float-label">
                        Confirm Password
                    </label>
                </div>
                <div className="submit-div">
                    <Link href="/auth/login" className="text-[.9rem]">
                        Already a user? Login
                    </Link>
                    <button type="submit" className="submit-button">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserRegistration;
