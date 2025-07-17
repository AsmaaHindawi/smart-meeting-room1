const Banner = ({ title, subtitle }) => {
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-indigo-700">{title}</h2>
      <p className="text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
};

export default Banner;
