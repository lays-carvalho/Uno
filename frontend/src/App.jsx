/*
 * [2025-07-23] João Neto:
 * Exemplo de App que podemos utilizar
 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
*/

import React from "react";
import Login from "./pages/Login";

function App() {
  return <Login />;
}

export default App;
