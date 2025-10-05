"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "./LoginModal";
import Notification from "./Notification";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout, successMessage, clearSuccessMessage } =
    useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#ffffff] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo-didactiva.png"
              alt="Didactiva"
              width={150}
              height={100}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#eventos"
              className="text-[#224383] font-bold hover:text-[#4DD0E1] transition-colors duration-200"
            >
              Eventos
            </a>
            <a
              href="#cursos"
              className="text-[#224383] font-bold hover:text-[#4DD0E1] transition-colors duration-200"
            >
              Cursos
            </a>
            <a
              href="#diplomados"
              className="text-[#224383] font-bold hover:text-[#4DD0E1] transition-colors duration-200"
            >
              Diplomados
            </a>
            <a
              href="#talleres"
              className="text-white hover:text-[#4DD0E1] transition-colors duration-200"
            >
              Talleres
            </a>
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-[#224383] font-medium">
                  Hola, {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => {}}
                className="bg-[#00BFA5] text-white px-6 py-2 rounded-lg hover:bg-[#00C853] transition-colors duration-200"
              >
                Inicio de Sesión
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[#4DD0E1]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#5A489B]">
            <nav className="flex flex-col space-y-4">
              <a
                href="#eventos"
                className="text-white hover:text-[#4DD0E1] transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </a>
              <a
                href="#cursos"
                className="text-white hover:text-[#4DD0E1] transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </a>
              <a
                href="#diplomados"
                className="text-white hover:text-[#4DD0E1] transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Diplomados
              </a>
              <a
                href="#talleres"
                className="text-white hover:text-[#4DD0E1] transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Talleres
              </a>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-white text-sm">
                    Hola, {user?.username}
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 w-full text-left"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {}}
                  className="bg-[#00BFA5] text-white px-6 py-2 rounded-lg hover:bg-[#00C853] transition-colors duration-200 w-full text-left"
                >
                  Inicio de Sesión
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Success Notification */}
      {successMessage && (
        <Notification
          message={successMessage}
          type="success"
          isVisible={!!successMessage}
          onClose={clearSuccessMessage}
        />
      )}
    </header>
  );
}
