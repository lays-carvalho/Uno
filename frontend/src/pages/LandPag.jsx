import unoLogo from "../Assets/Uno-Logo.png";
import "./LandPag.css";

function LandPag() {
  return (
    <div className="container">
      <img src={unoLogo} alt="UNO Logo" className="logo" />
      <div className="menu">
        <button className="btn green">HOW TO PLAY</button>
        <button className="btn blue">LOGIN</button>
        <button className="btn red">REGISTER</button>
        <button className="btn yellow">ABOUT US</button>
      </div>
    </div>
  );
}

export default LandPag;
