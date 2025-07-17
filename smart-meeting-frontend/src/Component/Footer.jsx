import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] text-white py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h3 className="text-2xl font-bold text-[#7B61FF] mb-2">Smart Meeting Room</h3>
          <p className="text-sm text-gray-400">
            Simplifying how you connect, collaborate, and meet. Smart tools for smart teams.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#7B61FF]">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <i className="fas fa-envelope text-[#7B61FF] mr-2"></i>
              contact@smartmeeting.com
            </li>
            <li>
              <i className="fas fa-phone text-[#7B61FF] mr-2"></i>
              +961 1 234 567
            </li>
            <li>
              <i className="fas fa-map-marker-alt text-[#7B61FF] mr-2"></i>
              Beirut, Lebanon
            </li>
          </ul>
        </div>

     
        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#7B61FF]">Follow Us</h4>
          <div className="flex space-x-6 text-2xl">
            <a href="#" className="hover:text-[#7B61FF] transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-[#7B61FF] transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-[#7B61FF] transition">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="hover:text-[#7B61FF] transition">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
