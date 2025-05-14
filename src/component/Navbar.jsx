import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [active, setActive] = useState("");

    const handleLinkClick = (label) => {
        setActive(label);
        setSidebarOpen(false);
    };

    return (
        <>
            <nav className="bg-[#004aad] shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-10">
                    <span className="font-bold text-white text-2xl tracking-wide">Fintellect</span>

                  
                    <div className="hidden md:flex items-center space-x-6 text-white">
                        {/* <span
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === "Tools" ? "bg-white text-[#004aad]" : ""}`}
                            onClick={() => handleLinkClick("Tools")}
                        >
                            Tools
                        </span>
                        <span
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === "Fund Explorer" ? "bg-white text-[#004aad]" : ""}`}
                            onClick={() => handleLinkClick("Fund Explorer")}
                        >
                            Fund Explorer
                        </span>
                        <span
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === "Model Portfolios" ? "bg-white text-[#004aad]" : ""}`}
                            onClick={() => handleLinkClick("Model Portfolios")}
                        >
                            Model Portfolios
                        </span>
                        <span
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === "Insights" ? "bg-white text-[#004aad]" : ""}`}
                            onClick={() => handleLinkClick("Insights")}
                        >
                            Insights
                        </span>
                        <span
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === "Pricing" ? "bg-white text-[#004aad]" : ""}`}
                            onClick={() => handleLinkClick("Pricing")}
                        >
                            Pricing
                        </span> */}
                        <Link
                            to="/networth-tracker"
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === " Networth Tracker" ? "bg-white text-[#004aad]" : ""}`}
                        >
                            Networth Tracker
                        </Link>

                        <Link
                            to="/bsa"
                            className={`cursor-pointer px-2 py-1 rounded-md transition duration-200 hover:bg-white hover:text-[#004aad] ${active === " BSA" ? "bg-white text-[#004aad]" : ""}`}
                        >
                            BSA
                        </Link>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <button className="p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white">
                        🌐 IN
                    </button>
                    <button className="bg-white text-[#004aad] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
                        Dashboard
                    </button>
                </div>

                <button
                    className="md:hidden text-3xl text-white focus:outline-none"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    ☰
                </button>
            </nav>

           
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

     
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-semibold text-xl text-[#004aad]">Fintellect</span>
                    <button
                        className="text-2xl text-gray-700 hover:text-black"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <ul className="flex flex-col p-4 space-y-4 text-gray-700">
                    <li
                        className={`cursor-pointer hover:text-[#004aad] px-2 py-1 rounded ${active === "Tools" ? "bg-[#e5f0ff] text-[#004aad]" : ""}`}
                        onClick={() => handleLinkClick("Tools")}
                    >
                        Tools
                    </li>
                    <li
                        className={`cursor-pointer hover:text-[#004aad] px-2 py-1 rounded ${active === "Fund Explorer" ? "bg-[#e5f0ff] text-[#004aad]" : ""}`}
                        onClick={() => handleLinkClick("Fund Explorer")}
                    >
                        Fund Explorer
                    </li>
                    <li
                        className={`cursor-pointer hover:text-[#004aad] px-2 py-1 rounded ${active === "Model Portfolios" ? "bg-[#e5f0ff] text-[#004aad]" : ""}`}
                        onClick={() => handleLinkClick("Model Portfolios")}
                    >
                        Model Portfolios
                    </li>
                    <li
                        className={`cursor-pointer hover:text-[#004aad] px-2 py-1 rounded ${active === "Insights" ? "bg-[#e5f0ff] text-[#004aad]" : ""}`}
                        onClick={() => handleLinkClick("Insights")}
                    >
                        Insights
                    </li>
                    <li
                        className={`cursor-pointer hover:text-[#004aad] px-2 py-1 rounded ${active === "Pricing" ? "bg-[#e5f0ff] text-[#004aad]" : ""}`}
                        onClick={() => handleLinkClick("Pricing")}
                    >
                        Pricing
                    </li>
                </ul>

                <div className="mt-auto p-4 border-t">
                    <button className="w-full p-2 text-left text-gray-700 hover:text-[#004aad]">
                        🌐 IN
                    </button>
                    <button className="w-full bg-[#004aad] text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-800 transition">
                        Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
