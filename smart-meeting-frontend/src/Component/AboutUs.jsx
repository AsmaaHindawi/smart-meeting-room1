import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-[#F9FAFB] py-20 px-6 md:px-20" id="about">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#1E293B] mb-4">About Us</h2>
        <p className="text-lg text-[#64748B] mb-12 max-w-3xl mx-auto">
          At <span className="text-[#7B61FF] font-semibold">Smart Meeting Room</span>, we are dedicated to transforming how organizations schedule, manage, and document meetings. We believe in smarter collaboration, time efficiency, and organized knowledge sharing.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
   
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-[#7B61FF] mb-3">Our Mission</h3>
            <p className="text-[#64748B] text-l leading-relaxed">
              To provide a smart and intuitive meeting management platform that enhances productivity, simplifies room scheduling, and delivers clear meeting documentation.
            </p>
          </div>

        
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-[#7B61FF] mb-3">Our Vision</h3>
            <p className="text-[#64748B] text-l leading-relaxed">
              To be the leading digital solution for meeting room management and collaboration across modern organizations, promoting efficient communication and time-saving strategies.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-[#7B61FF] mb-3">Our Core Values</h3>
            <ul className="text-[#64748B] text-l list-disc pl-5 space-y-1">
              <li>Efficiency</li>
              <li>Transparency</li>
              <li>User-centric design</li>
              <li>Continuous innovation</li>
              <li>Collaboration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
