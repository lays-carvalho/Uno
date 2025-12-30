import React from "react";
import { Routes, Route } from "react-router-dom";
import LandPag from "./pages/LandPag";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/ProfilePage";
import Lobby from "./pages/GameLobby"
import GamesList from "./pages/GameList"
import Ranking from "./pages/Ranking"
import GamePag from "./pages/InComing"
import HowToPlay from "./pages/HowToPlay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandPag />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aboutus-public" element={<AboutUs backTo="/" />} />
      <Route path="/aboutus-private" element={<AboutUs backTo="/main" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/games" element={<GamesList />} />
      <Route path="/lobby/:id" element={<Lobby />} />
      <Route path="/Ranking" element={<Ranking />} />
      <Route path="/Game/:id" element={<GamePag />} />
      <Route path="/how-to-play-public" element={<HowToPlay backTo="/" />} />
      <Route path="/how-to-play-private" element={<HowToPlay backTo="/main" />} />
    </Routes>
  );
}

export default App;
