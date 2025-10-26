import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/Navbar';

const MainLayout = () => {
    const location = useLocation();
    const hideLayoutRoutes = ["/login", "/register"]; // এই route গুলিতে Navbar/Footer hide হবে

    const hideNavbarFooter = hideLayoutRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
            {!hideNavbarFooter && <Navbar />}

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {!hideNavbarFooter && <Footer />}

            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default MainLayout;
