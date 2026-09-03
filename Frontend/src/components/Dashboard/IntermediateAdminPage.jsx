import React from 'react';

function IntermediateAdminPage({ onLogout }) {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            {/* Navigation Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Admin Approval Required</h1>
                            <span className="text-xs text-amber-600 font-semibold">Account Pending Activation</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Center Warning Card */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 sm:p-10 max-w-lg w-full text-center">
                    <div className="relative mb-6 inline-block">
                        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                            <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                        </span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Account Pending Approval</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Your admin registration request has been submitted. A root administrator must review and activate your account before you can access administrative functions.
                    </p>

                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-left mb-6 space-y-2">
                        <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider">Next Steps:</h3>
                        <ul className="text-xs text-amber-800 space-y-1.5 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Root administrator notification dispatched
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Dashboard access unlocks automatically upon approval
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Click below to refresh approval status anytime
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/20 font-bold text-sm"
                    >
                        Refresh Approval Status
                    </button>
                </div>
            </div>

            <footer className="py-4 text-center text-xs text-slate-400">
                Excel Analytics Platform &bull; Security & Control
            </footer>
        </div>
    );
}

export default IntermediateAdminPage;