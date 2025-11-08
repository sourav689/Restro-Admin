import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

// --- Reusable Button Component (Inline Styles) ---
const Button = ({ children, style, disabled, ...props }) => {
    const defaultStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s',
        height: '40px',
        padding: '0 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: 'none',
        
        // Default color style
        background: 'linear-gradient(to right, #d4af37, #b8860b)', // Gold gradient
        color: '#1a1510',
    };

    return (
        <button
            style={{ ...defaultStyle, ...style }}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

// --- Reusable Input Component (Inline Styles) ---
const Input = ({ style, type, ...props }) => {
    const defaultStyle = {
        display: 'block', // Changed to block to ensure width: 100% works consistently
        height: '40px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid rgba(212, 175, 55, 0.4)', // border-[#d4af37]/40
        backgroundColor: 'rgba(26, 21, 16, 0.5)', // bg-[#1a1510]/50
        
        // === FIX APPLIED HERE ===
        // Setting box-sizing to border-box prevents padding/border from adding to the 100% width.
        boxSizing: 'border-box', 
        padding: '8px 12px 8px 40px', // padding-left adjusted to 40px for icon clearance
        
        fontSize: '14px',
        color: '#d4af37',
        outline: 'none',
    };

    return (
        <input
            type={type}
            style={{ ...defaultStyle, ...style }}
            {...props}
        />
    );
};

// --- Reusable Label Component (Inline Styles) ---
const Label = ({ children, style, ...props }) => (
    <label
        style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(212, 175, 55, 0.8)' }}
        {...props}
    >
        {children}
    </label>
);

// --- AdminLogin Component ---
export default function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        
        // This logic should be placed here, as it's the component that calls the prop function
        const result = onLogin(username, password); 
        if (!result.success) {
            setLoginError(result.error);
        }
    };

    // --- Inline Styles ---
    const formContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
    };

    const formStyle = {
        width: '100%',
        maxWidth: '384px', // max-w-sm
        padding: '32px',
        borderRadius: '12px',
        border: '2px solid rgba(212, 175, 55, 0.5)', // border-[#d4af37]/50
        boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.3), 0 4px 6px -2px rgba(212, 175, 55, 0.3)', // shadow-2xl shadow-[#d4af37]/30
        background: 'linear-gradient(to bottom right, #2e261d, #1a1510)',
    };
    
    const titleStyle = {
        textAlign: 'center',
        fontFamily: 'serif',
        fontSize: '24px',
        color: '#d4af37',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    };

    return (
        <motion.div
            style={formContainerStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
        >
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>
                    <LogIn size={24} /> Admin Login
                </h2>
                
                {/* Username Input */}
                <div style={{ marginBottom: '16px' }}>
                    <Label htmlFor="username">Username</Label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#f0c674', zIndex: 10 }} />
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter username"
                        />
                    </div>
                </div>
                
                {/* Password Input */}
                <div style={{ marginBottom: '24px' }}>
                    <Label htmlFor="password">Password</Label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#f0c674', zIndex: 10 }} />
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                </div>
                
                {loginError && (
                    <p style={{ color: '#f87171', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
                        {loginError}
                    </p>
                )}
                
                <Button
                    type="submit"
                    style={{ width: '100%', padding: '12px', fontSize: '18px', fontWeight: '700' }}
                >
                    Log In
                </Button>
            </form>
        </motion.div>
    );
}