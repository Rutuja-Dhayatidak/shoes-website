import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardLayout = ({ children, menuItems, user, title, subtitle, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully 👋", { position: "top-right", autoClose: 1000 });
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="relative min-h-screen bg-[#0a0f1a] flex overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`fixed lg:relative z-[70] w-72 h-screen flex flex-col bg-[#0a0f1a]/95 lg:bg-[#0a0f1a]/40 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Brand/Logo */}
        <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-[0.2em] uppercase text-white hover:opacity-80 transition-all">
            BRAND<span className="text-blue-500">.</span>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                  ? "bg-blue-500/10 text-white border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <div className={`transition-colors duration-300 ${activeTab === item.id ? "text-blue-400" : "group-hover:text-blue-400"}`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 lg:p-6 border-t border-white/5 space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronLeft size={14} /> Go Back
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-50 hover:text-white transition-all duration-300 text-sm uppercase tracking-[0.2em] font-black py-4 rounded-2xl group shadow-lg shadow-red-500/5"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* Top Navbar */}
        <header className="h-20 lg:h-24 flex items-center justify-between px-4 lg:px-10 border-b border-white/5 bg-[#0a0f1a]/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                {title} <span className="text-blue-500">.</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-white tracking-wide">{user.name}</p>
              <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black opacity-70">{user.role}</p>
            </div>
            <div className="relative group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-base lg:text-lg font-black text-white uppercase tracking-widest">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0f1a] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar animate-in fade-in duration-700">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
