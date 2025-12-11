import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

interface MyTokenPayload {
  user: {
    id: number;
    username: string;
  };
  iat?: number;
}

interface RestaurantInfo {
  ID: number;
  NAME: string;
  DESCRIPTION: string;
  LOGO_URL: string;
  created_at: string;
  updated_at: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<string>("");
  const [user_status, set_user_status] = useState<boolean>(false);
  const [data, setData] = useState<RestaurantInfo | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const { table_number } = useParams();

  void (user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const load = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/get_restaurant_info");
        const json = await res.json();
        setData(json);
      }
      catch (error) {
        console.error(error);
      }
    };

    // ตรวจ token
    if (token) {
      try {
        const decoded = jwtDecode<MyTokenPayload>(token);
        setUser(decoded.user.username);
        set_user_status(true);
      }
      catch (err) {
        localStorage.removeItem("token");
        setUser("");
        set_user_status(false);
      }
    }

    load();

    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem("announcement_last_seen");

    if (lastSeen === today) {
      setShowPopup(false);
    }
    else {
      setShowPopup(true);
    }

  }, []);


  return (
    <nav className="bg-[#181818] fixed top-0 w-full z-50 shadow-2xl">
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-start justify-center pt-46 z-10">

          <div className="bg-white w-11/12 max-w-md rounded-xl shadow-xl p-6 animate-fadeIn">

            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">📢 ประกาศ</h2>

            <p className="text-gray-700 text-center mb-6 wrap-break-word">
              {data?.DESCRIPTION}
            </p>

            <button
              onClick={() => {
                const today = new Date().toDateString();
                localStorage.setItem("announcement_last_seen", today);
                setShowPopup(false);
              }}
              className="block w-full bg-[#181818] text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )
      }

      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold text-white">{data?.NAME || "Loading..."}</div>
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu */}
        <div
          className={`
    w-full lg:w-auto
    flex flex-col lg:flex-row lg:items-center
    absolute lg:static top-full left-0
    bg-[#181818] lg:bg-transparent
    overflow-hidden
    transition-[max-height] duration-300 ease-in-out
    ${isOpen ? 'max-h-60' : 'max-h-0'} lg:max-h-none
  `}
        >
          <a
            href={`/${table_number}/`}
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          {user_status ? (<a
            href="/dashboard"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"

            onClick={() => {
              setIsOpen(false)
            }}
          >
            Dashboard
          </a>) : ("")}
          {user_status ? (<a
            href="/settingPage"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"

            onClick={() => {
              setIsOpen(false)
            }}
          >
            Set restaurant
          </a>) : ("")}
          {user_status ? (<a
            href="/settingMenu"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"

            onClick={() => {
              setIsOpen(false)
            }}
          >
            Set menu
          </a>) : ("")}
          {user_status ? (<a
            href="/#"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"

            onClick={() => {
              setIsOpen(false)
            }}
          >
            Orders
          </a>) : ("")}
          {user_status ? (<a
            href="/login"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"

            onClick={() => {
              localStorage.removeItem("token");
              setUser("");
              set_user_status(false);
              setIsOpen(false)
            }}
          >
            Log out
          </a>) : (<a
            href="/login"
            className="block px-4 py-2 text-white hover:underline lg:inline-block ml-2"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Login
          </a>)}
        </div>

      </div>
    </nav >
  );
};

export default Navbar;
