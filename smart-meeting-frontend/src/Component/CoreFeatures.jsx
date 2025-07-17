import React from 'react';

const features = [
  {
    icon: 'fas fa-user-lock',
    title: 'User Access & Roles',
    description: 'Manage accounts with secure login, roles for Admin, Employee, and Guest.',
  },
  {
    icon: 'fas fa-door-open',
    title: 'Room Management',
    description: 'Create and manage meeting rooms, with info on capacity, location, and equipment.',
  },
  {
    icon: 'fas fa-calendar-check',
    title: 'Smart Booking',
    description: 'Book rooms by time slot, avoid conflicts, and view availability in a calendar.',
  },
  {
    icon: 'fas fa-tasks',
    title: 'Meeting Setup',
    description: 'Plan meetings with title, agenda, and invite participants from the team.',
  },
  {
    icon: 'fas fa-file-alt',
    title: 'Minutes of Meeting',
    description: 'Record discussion points, decisions, and assign tasks — export as PDF or print.',
  },
  {
    icon: 'fas fa-calendar-alt',
    title: 'Calendar View',
    description: 'See meetings and bookings in monthly or weekly views, with filtering options.',
  },
  {
    icon: 'fas fa-bell',
    title: 'Notifications',
    description: 'Get alerts for invitations, booking confirmations, and assigned tasks.',
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Reports & Insights',
    description: 'Track meeting trends, room usage stats, and export detailed reports.',
  },
];

const CoreFeatures = () => {
  return (
    <section
      className="py-20 bg-fixed bg-center bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: `url('/Images/Sign.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-[#7B61FF] mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300"
            >
              <div className="text-4xl text-[#7B61FF] mb-4">
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
