import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="relative flex items-center justify-between px-10 py-4 shadow-md bg-white overflow-hidden">
        <Link to="/">
          <div className="z-10">
            <img
              src="/Images/logoMeetSM.png"
              alt="SmartMeet Logo"
              className="h-20 max-w-30 ml-20"
            />
          </div>
        </Link>

        <ul
          className="z-10 hidden md:flex space-x-25 font-medium text-lg"
          style={{ color: "#2c2e5f", fontSize: "19px", fontWeight: "bold" }}
        >
          <li>
            <a
              href="#about"
              className="hover:text-[#7d64fb] transition duration-200"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="#features"
              className="hover:text-[#7d64fb] transition duration-200"
            >
              Features
            </a>
          </li>
          <li>
            <button
              onClick={() => setShowContactForm(true)}
              className="hover:text-[#7d64fb] transition duration-200"
            >
              Contact Us
            </button>
          </li>
        </ul>

        <div className="z-10 flex items-center space-x-14 mr-20">
          <Link
            to="/signin"
            className="bg-white text-[#2c2e5f] border border-[#2c2e5f] px-5 py-2 rounded-full hover:bg-[#7d64fb] hover:text-white transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </nav>

   {showContactForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
    <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 mx-4">
      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowContactForm(false)}
          className="text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-1">Contact Us</h2>
      <p className="text-sm text-center text-gray-500 mb-6">We'd love to hear from you!</p>

      {/* Contact Form */}
      <form className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Your Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Your Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Message</label>
          <textarea
            rows="4"
            placeholder="Write your message..."
            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:from-indigo-600 hover:to-indigo-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
)}


    </>
  );
}

export default Navbar;
