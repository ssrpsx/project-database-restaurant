import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#181818] fixed top-0 w-full z-50 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold text-white">My Restaurant</div>

        <div className="md:hidden">
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
    w-full md:w-auto
    flex flex-col md:flex-row md:items-center
    absolute md:static top-full left-0
    bg-[#181818] md:bg-transparent
    overflow-hidden
    transition-[max-height] duration-300 ease-in-out
    ${isOpen ? 'max-h-60' : 'max-h-0'} md:max-h-none
  `}
        >
          <a
            href="/"
            className="block px-4 py-2 text-white hover:underline md:inline-block ml-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/login"
            className="block px-4 py-2 text-white hover:underline md:inline-block ml-2"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
