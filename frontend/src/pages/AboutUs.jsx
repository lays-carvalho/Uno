import React from "react";
import "./AboutUs.css";

import BackButton from "../components/BackButton";

import unoLogo from "../Assets/Uno-Logo.png";
import RafaelImg from "../Assets/Team/Rafael.jpg";
import LauraImg from "../Assets/Team/Laura.jpg";
import AliceImg from "../Assets/Team/Alice.jpg";
import BrunoImg from "../Assets/Team/Bruno.png";
import AdrianImg from "../Assets/Team/Adrian.png";
import NetoImg from "../Assets/Team/Neto.jpg";
import LaysImg from "../Assets/Team/Lays.jpg";

export default function AboutUs() {
  const teamMembers = [
    { role: "Professor", name: "Bruno Santos Cezario", img: BrunoImg },
    { role: "Backend", name: "João Neto", img: NetoImg },
    { role: "Backend", name: "Lays Carvalho", img: LaysImg },
    { role: "Backend", name: "Rafael Macedo", img: RafaelImg },

    { role: "Practitioner", name: "Adrian Fernandez", img: AdrianImg },
    { role: "Frontend", name: "Laura Victória da Costa", img: LauraImg },
    { role: "Frontend", name: "Maria Alice Freitas", img: AliceImg },
    { role: "Frontend", name: "Pedro Carneiro", img: "https://via.placeholder.com/100" },
  ];

  return (
    <div className="team-background">
      <img src={unoLogo} alt="UNO Logo" className="uno-logo-fixed" />
      <BackButton /> {}
      <div className="team-panel">
        <h1 className="team-title">PROGRAMMING 4 CAPSTONE - UNO</h1>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-role">{member.role}</div>
              <div className="team-img-wrapper">
                <img src={member.img} alt={member.name} className="team-img" />
              </div>
              <div className="team-name">{member.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
