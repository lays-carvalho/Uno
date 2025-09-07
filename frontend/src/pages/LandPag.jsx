import { useNavigate } from "react-router-dom";
import unoLogo from "../Assets/Uno-Logo.png";
import "./LandPag.css";
import usePageTitle from "../hooks/usePageTitle";

function LandPag() {
  usePageTitle("UNO - WELCOME");
  const navigate = useNavigate();

  const menuItems = [
    { label: "HOW TO PLAY", color: "green", onClick: () => {} },
    { label: "LOGIN", color: "blue", onClick: navigate => navigate("/login") },
    { label: "REGISTER", color: "red", onClick: navigate => navigate("/register") },
    { label: "ABOUT US", color: "yellow", onClick: navigate => navigate("/aboutus") },
  ];

  return (
    <div className="container">
      <img src={unoLogo} alt="UNO Logo" className="logo" />
      <div className="menu">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`btn ${item.color}`}
            onClick={() => item.onClick(navigate)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LandPag;
