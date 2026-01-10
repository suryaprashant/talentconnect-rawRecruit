import { useNavigate } from "react-router-dom";

const BackButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate(fallback);
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="
        inline-flex items-center justify-center
        px-6 py-3
        rounded-2xl

        bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500
        text-white text-base font-semibold

        shadow-md shadow-indigo-500/25
        hover:shadow-lg hover:shadow-indigo-500/35
        hover:-translate-y-0.5

        active:scale-95
        transition-all duration-300 ease-out

        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
      "
    >
      Back
    </button>
  );
};

export default BackButton;
