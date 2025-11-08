import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Loader2, CheckCircle2, User, Users, Home as HomeIcon, Warehouse, Tent, Phone, Table as TableIcon, LogOut } from 'lucide-react';

// --- Constants (Backend Endpoints) ---
const TABLE_ENDPOINT = 'https://royal-restaurant-lanx.onrender.com/restaurant/table';
const ADMIN_ENDPOINT = 'https://royal-restaurant-lanx.onrender.com/admin'; 

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
        
        // Default style for Mark Done button
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

// --- AdminDashboard Component ---
export default function AdminDashboard({ onLogout }) {
    const [bookedTables, setBookedTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [submittingId, setSubmittingId] = useState(null);

    const fetchBookedTables = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await fetch(TABLE_ENDPOINT, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'fetch_tables_admin' }), 
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch table data. Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
               const booked = data.filter(table => table.isbook);
               setBookedTables(booked);
            } else {
               throw new Error('Backend returned invalid data format.');
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            setFetchError(error.message || 'Could not connect to the backend. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookedTables();
    }, [fetchBookedTables]);
    
    const handleMarkDone = async (tableId) => {
        setSubmittingId(tableId);
        setFetchError(null);
        
        try {
            const response = await fetch(ADMIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table_id: tableId, action: 'mark_done' }),
            });

            if (!response.ok) {
                throw new Error(`Failed to mark table ${tableId} as done. Server error.`);
            }

            await response.json();
            fetchBookedTables();
            
        } catch (error) {
            console.error('Error marking table done:', error);
            setFetchError(error.message || `Failed to mark table ${tableId} as done.`);
        } finally {
            setSubmittingId(null);
        }
    };

    // --- Inline Styles ---
    const dashboardContainerStyle = {
        maxWidth: '1152px', // max-w-6xl
        margin: '0 auto',
        padding: '48px 0',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    };

    const titleStyle = {
        fontFamily: 'serif',
        fontSize: '48px',
        color: '#d4af37',
        letterSpacing: '0.05em', // tracking-wider
    };
    
    const cardGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
    };

    const cardStyle = {
        position: 'relative',
        padding: '24px',
        borderRadius: '16px',
        border: '2px solid #d4af37',
        background: 'linear-gradient(to bottom right, #2e261d, #1a1510)',
        boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.3), 0 4px 6px -2px rgba(212, 175, 55, 0.3)',
    };
    
    const cardHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.5)',
        paddingBottom: '8px',
    };

    const bookedTagStyle = {
        fontSize: '12px',
        padding: '4px 12px',
        backgroundColor: '#7d2948',
        fontWeight: '700',
        color: 'white',
        borderRadius: '9999px', // rounded-full
    };

    const detailsTextStyle = {
        color: '#f0c674',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
    };

    return (
        <motion.div
            style={dashboardContainerStyle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div style={headerStyle}>
                <h1 style={titleStyle}>
                    Admin Dashboard
                </h1>
                <Button 
                    onClick={onLogout} 
                    style={{ backgroundColor: '#7d2948', color: 'white', background: 'none', border: '1px solid #7d2948', fontWeight: '700' }}
                >
                    <LogOut size={16} style={{ marginRight: '8px' }}/> Logout
                </Button>
            </div>
            
            {/* Error / Loading / Empty States */}
            {fetchError && (
                <div style={{ textAlign: 'center', padding: '16px', marginBottom: '24px', color: '#f87171', backgroundColor: 'rgba(124, 45, 18, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '16px', fontSize: '20px' }}>System Error: {fetchError}</p>
                    <Button 
                        onClick={fetchBookedTables} 
                        style={{ backgroundColor: '#7d2948', color: 'white', background: 'none', border: '1px solid #7d2948' }}
                    >
                        Retry Fetching Tables
                    </Button>
                </div>
            )}
            
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                    <p>Fetching active bookings...</p>
                </div>
            ) : bookedTables.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '12px', color: 'rgba(212, 175, 55, 0.7)' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 16px auto', color: '#d4af37' }} />
                    <p style={{ fontSize: '18px' }}>All tables are currently available. No active bookings.</p>
                </div>
            ) : (
                // Table Cards Grid
                <div style={cardGridStyle}>
                    <AnimatePresence>
                        {bookedTables.map((table) => (
                            <motion.div
                                key={table.table_id}
                                style={cardStyle}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div style={cardHeaderStyle}>
                                    <h2 style={{ fontFamily: 'serif', fontSize: '24px', color: '#d4af37', display: 'flex', alignItems: 'center' }}>
                                        <TableIcon size={20} style={{ marginRight: '8px' }} />
                                        Table {table.table_id}
                                    </h2>
                                    <span style={bookedTagStyle}>
                                        BOOKED
                                    </span>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <p style={detailsTextStyle}>
                                        <Users size={16} style={{ color: '#d4af37' }} />
                                        Seats: <strong>{table.chair_no}</strong>
                                    </p>
                                    <p style={detailsTextStyle}>
                                        {table.table_place === 'Indoor' ? <Warehouse size={16} style={{ color: '#d4af37' }} /> : <Tent size={16} style={{ color: '#d4af37' }} />}
                                        Location: <strong>{table.table_place}</strong>
                                    </p>
                                    <p style={detailsTextStyle}>
                                        <HomeIcon size={16} style={{ color: '#d4af37' }} />
                                        Seating: <strong>{table.isfamily ? 'Family' : 'Standard'}</strong>
                                    </p>
                                </div>
                                
                                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.3)' }}>
                                    <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '8px', fontWeight: '600' }}>Customer Details</h3>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(212, 175, 55, 0.8)', marginBottom: '4px' }}>
                                        <User size={16} />
                                        Name: <strong>{table.user_name || 'N/A'}</strong>
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(212, 175, 55, 0.8)' }}>
                                        <Phone size={16} />
                                        Phone: <strong>{table.user_phone || 'N/A'}</strong>
                                    </p>
                                </div>

                                <Button
                                    onClick={() => handleMarkDone(table.table_id)}
                                    disabled={submittingId !== null}
                                    style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(to right, #d4af37, #b8860b)', color: '#1a1510', fontWeight: '700' }}
                                >
                                    {submittingId === table.table_id ? (
                                        <>
                                            <Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} style={{ marginRight: '8px' }} />
                                            Mark Booking Done
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {/* Define spin keyframes for the Loader2 icon */}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </motion.div>
    );
}