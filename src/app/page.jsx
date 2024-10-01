"use client";

import React from "react";

const Index = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] w-full bg-[var(--background)]">
            <div className="w-1/2 flex items-center justify-center bg-[var(--accent)] relative">
                <span className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--foreground)] text-[var(--primary-foreground)] text-sm inline-block p-1 rounded-md mb-2">
                    Enterprise
                </span>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[var(--card-foreground)]">
                        For{" "}
                        <span className="text-[var(--primary)]">Admins</span>
                    </h1>
                    <div className="mx-auto w-1/3 my-5 text-xl">
                        Assess project needs, prioritize tasks, and ensure that
                        assignments align with individual strengths and
                        workloads.
                    </div>
                    <button
                        onClick={() => (window.location.href = "/work/login")}
                        className="px-10 py-2 rounded-md text-lg font-bold text-primary-foreground bg-primary hover:bg-accent border-2 border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                        Login
                    </button>
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center bg-[var(--background)]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[var(--foreground)]">
                        For <span className="text-[var(--primary)]">Users</span>
                    </h1>
                    <div className="mx-auto w-1/3 my-5 text-xl">
                        Receive tasks assigned by admins or create your own.
                        Complete these tasks to support team objectives.
                    </div>
                    <button
                        onClick={() => (window.location.href = "/auth/login")}
                        className="px-10 py-2 rounded-md text-lg font-bold text-primary bg-background hover:bg-primary border-2 border-[var(--primary)] hover:text-primary-foreground"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;
