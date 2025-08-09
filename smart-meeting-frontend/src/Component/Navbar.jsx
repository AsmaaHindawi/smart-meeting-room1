import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Navbar() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await api.post("/contact", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setShowContactForm(false);
        setStatus("");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus(" Failed to send message. Please try again.");
    }
  };

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
            <a href="#about" className="hover:text-[#7d64fb] transition duration-200">
              About Us
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-[#7d64fb] transition duration-200">
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

      {/* Contact Form Modal */}
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
            <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-1">
              Contact Us
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              We'd love to hear from you!
            </p>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-600">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
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

              {status && (
                <p className="text-center text-sm mt-2 text-gray-700">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
