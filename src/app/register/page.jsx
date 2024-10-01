"use client";

import { useState } from "react";

const Register = () => {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleSubmit = () => {
        if (selectedRole) {
            window.location.href = `/register/${selectedRole}`;
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center w-full bg-[var(--background)]">
            <div className="flex flex-col items-center justify-center bg-[var(--card)] relative p-20 rounded-lg max-w-xl w-full shadow-lg">
                <h1 className="text-5xl font-bold text-[var(--card-foreground)] text-center mb-12">
                    How do you want to register?
                </h1>
                <div className="flex flex-col space-y-4 w-full">
                    <div
                        className={`p-6 bg-[var(--input)] rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedRole === "admin"
                                ? "outline outline-2 outline-[var(--primary)]"
                                : "outline outline-2 outline-transparent hover:outline-[var(--primary)]"
                        }`}
                        onClick={() => setSelectedRole("admin")}
                    >
                        <h2 className="text-[1.2rem] font-semibold text-[var(--card-foreground)]">&lt; Admin</h2>
                        <p className="mt-2 text-[var(--card-foreground)]">
                            Manage projects and assign tasks.
                        </p>
                    </div>
                    <div
                        className={`p-6 bg-[var(--input)] rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedRole === "user"
                                ? "outline outline-2 outline-[var(--primary)]"
                                : "outline outline-2 outline-transparent hover:outline-[var(--primary)]"
                        }`}
                        onClick={() => setSelectedRole("user")}
                    >
                        <h2 className="text-[1.2rem] font-semibold text-[var(--card-foreground)]">&gt; User</h2>
                        <p className="mt-2 text-[var(--card-foreground)]">
                            Receive and complete tasks or <br /> create and manage your own tasks.
                        </p>
                    </div>
                </div>
                <button
                    className={`mt-6 px-8 py-2 rounded-md font-semibold transition-all duration-300 ${
                        selectedRole
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] hover:shadow-md active:scale-95"
                            : "bg-gray-300 text-gray-500 opacity-50"
                    }`}
                    onClick={handleSubmit}
                    disabled={!selectedRole}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
};
export default Register;

