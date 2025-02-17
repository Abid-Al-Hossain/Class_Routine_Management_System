import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Class Routine Management System</p>
      </div>
    </footer>
  );
};
