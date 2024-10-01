"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch("/protected", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            role:
                                pathname === "/admin/tasks"
                                    ? "admins"
                                    : "users",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            setIsLoggedIn(true);
                            setUser(data.user);
                        } else {
                            handleLogout();
                        }
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Auth check error:", error);
                    handleLogout();
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        router.push("/");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const navLinks = [
        ...(isLoggedIn
            ? [
                  { href: "/tasks", label: "Tasks" },
                  { href: "/teams", label: "Teams" },
              ]
            : []),
    ];

    const handleAuthClick = () => {
        if (isLoggedIn) {
            handleLogout();
        } else if (
            pathname === "/auth/login" ||
            pathname === "/work/login" ||
            pathname === "/"
        ) {
            router.push("/register");
        } else {
            router.push("/");
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <nav className="bg-card shadow-md dark:shadow-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-2xl font-semibold text-foreground"
                        >
                            Task Manager
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex space-x-4">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            isActive
                                                ? "text-primary-foreground bg-primary"
                                                : "text-foreground hover:bg-primary hover:text-primary-foreground"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-sm font-medium text-foreground bg-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                            {theme === "light" ? "🌞" : "🌙"}
                        </button>
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex text-sm rounded-full bg-primary"
                                >
                                    <Image
                                        className="h-8 w-8 rounded-full"
                                        src={`/profile-${user.gender}.png`}
                                        alt="User photo"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-card ring-1 ring-border border border-border">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                                        >
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-border" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleAuthClick}
                                className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] hover:shadow-md active:scale-95"
                            >
                                {pathname === "/auth/login" ||
                                pathname === "/work/login" ||
                                pathname === "/"
                                    ? "Register"
                                    : "Login"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
