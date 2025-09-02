import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import Logo from '../../../public/Hiresense.png'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import axios from "axios";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchUser = async () => {
    try {
      const token = getCookie('accessToken') || localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('token not found');
        return;
      }

      const response = await axios.get('/api/user/getuser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens from cookies and localStorage
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("jobs")) return "Jobs";
    if (path.includes("applicants")) return "Applicants";
    if (path.includes("interviews")) return "Interviews";
    if (path.includes("reports")) return "Reports";
    if (path.includes("settings")) return "Settings";
    return "Dashboard";
  };

  const activeItem = getActiveItem();

  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/organization/dashboard",
    },
    { name: "Jobs", icon: Briefcase, path: "/organization/jobs" },
    { name: "Applicants", icon: Users, path: "/applicants" },
    { name: "Interviews", icon: Calendar, path: "/interviews" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg">
              <img src={Logo} alt="" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">
              HireSence
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center w-full px-6 py-3 text-left transition-colors duration-200 ${
                  activeItem === item.name
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="mx-4 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-600 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="relative ml-4 lg:ml-0">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative ml-4 profile-dropdown flex gap-3" >
              Hi, {user.fullName}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center max-w-xs rounded-full focus:outline-none"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >

                {user.avatar ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.avatar}
                    alt="Profile"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                )}
                <ChevronDown size={16} className="ml-1 text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;