import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Users, UserCircle, GraduationCap, User } from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: "Course Coordinator",
      icon: Users,
      path: "/coordinator",
      description: "Manage class schedules and coordinate with teachers",
    },
    {
      title: "Teacher",
      icon: UserCircle,
      path: "/teacher",
      description: "View schedules and manage classes",
    },
    {
      title: "Student",
      icon: GraduationCap,
      path: "/student",
      description: "Access class schedules and information",
    },
    {
      title: "Class Representative",
      icon: User,
      path: "/representative",
      description: "Coordinate between students and teachers",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Class Routine Management System" />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <div
                key={dashboard.path}
                onClick={() => navigate(dashboard.path)}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <Icon size={48} className="text-indigo-600 mb-4" />
                  <h2 className="text-xl font-bold mb-2">{dashboard.title}</h2>
                  <p className="text-gray-600">{dashboard.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
