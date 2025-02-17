import React from "react";
import { Link } from "react-router-dom";
import { School } from "lucide-react";

interface NavbarProps {
  title: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  showLogout,
  onLogout,
}) => {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <School size={24} />
          <span className="text-xl font-bold">{title}</span>
        </div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-200">
            Home
          </Link>
          {showLogout && (
            <button onClick={onLogout} className="hover:text-indigo-200">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
