// src/components/UI/Button.jsx
import React from "react";

export default function Button({
  children,           // Teks di dalam tombol
  onClick,            // Fungsi pas diklik
  type = "button",    // "button" atau "submit" (buat form)
  variant = "primary", // Pilihan: primary, secondary, danger, outline
  className = "",     // Buat nambahin class Tailwind custom kalau butuh
  icon,               // Icon dari react-icons
  disabled = false,   // Kalau lagi loading/ngga bisa diklik
  ...props
}) {
  // 1. Gaya dasar yang dimiliki SEMUA tombol
  const baseStyles = "flex items-center justify-center gap-2 font-semibold rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const padding = "px-4 py-2 text-sm"; // Ukuran standar

  // 2. Variasi warna (Bisa lu tambah-tambahin sendiri nanti)
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // Gabungin semua class Tailwind-nya di sini
      className={`${baseStyles} ${variants[variant]} ${padding} ${className}`}
      {...props}
    >
      {/* Kalau ada icon, tampilin icon-nya di sebelah kiri teks */}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}