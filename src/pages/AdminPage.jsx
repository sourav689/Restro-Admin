import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLogin from './AdminLogin';        
import AdminDashboard from './AdminDashboard'; 

// --- Constants (Shared) ---
const ADMIN_USERNAME = 'admin'; 
const ADMIN_PASSWORD = 'password'; 

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Login Simulation logic
    const handleLogin = (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD || 
            (username === 'test' && password === 'test')) {
            setIsAuthenticated(true);
            return { success: true };
        } else {
            return { success: false, error: 'Invalid credentials. Try "admin/password" or "test/test".' };
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    // --- Inline Styles ---
    const pageStyle = {
        minHeight: '100vh',
        padding: '96px 24px 64px 24px', // pt-24 pb-16 px-6
        background: 'linear-gradient(to bottom, #1a1510, #221c14, #1a1510)',
        fontFamily: 'sans-serif',
    };

    return (
        <div style={pageStyle}>
            <AnimatePresence mode="wait">
                {isAuthenticated ? (
                    <AdminDashboard key="dashboard" onLogout={handleLogout} />
                ) : (
                    <AdminLogin key="login" onLogin={handleLogin} />
                )}
            </AnimatePresence>
        </div>
    );
}