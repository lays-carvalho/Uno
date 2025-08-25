import React, { useState } from "react";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de registro aqui pra fazer depois
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#414141",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#181818",
          borderRadius: "30px",
          width: "320px",
          padding: "0 32px 32px 32px",
          boxSizing: "border-box",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Barra Colorida */}
        <div style={{
          display: "flex",
          width: "100%",
          height: "16px",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          overflow: "hidden",
          marginBottom: "32px"
        }}>
          <div style={{ flex: 1, background: "#7bb12b" }} />
          <div style={{ flex: 1, background: "#3b7ec9" }} />
          <div style={{ flex: 1, background: "#e74c3c" }} />
          <div style={{ flex: 1, background: "#f1c40f" }} />
        </div>

        {/* campo do usuario */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#e0e0e0",
          borderRadius: "20px",
          padding: "8px 16px",
          marginBottom: "14px",
          width: "100%"
        }}>
          <FaUser style={{ color: "#555", marginRight: "10px" }} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1rem",
              width: "100%"
            }}
            required
          />
        </div>

        {/* Campo do email */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#e0e0e0",
          borderRadius: "20px",
          padding: "8px 16px",
          marginBottom: "14px",
          width: "100%"
        }}>
          <FaEnvelope style={{ color: "#555", marginRight: "10px" }} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1rem",
              width: "100%"
            }}
            required
          />
        </div>

        {/* Campo da senha */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#e0e0e0",
          borderRadius: "20px",
          padding: "8px 16px",
          marginBottom: "14px",
          width: "100%"
        }}>
          <FaKey style={{ color: "#555", marginRight: "10px" }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1rem",
              width: "100%"
            }}
            required
          />
        </div>

        {/* Campo para confirmar a senha */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#e0e0e0",
          borderRadius: "20px",
          padding: "8px 16px",
          marginBottom: "28px",
          width: "100%"
        }}>
          <FaKey style={{ color: "#555", marginRight: "10px" }} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1rem",
              width: "100%"
            }}
            required
          />
        </div>

        {/* Botão register, quiser mudar depois fiquem avontade*/}
        <button
          type="submit"
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            width: "100%",
            padding: "14px 0",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "18px"
          }}
        >
          REGISTER
        </button>

        {/* Link para login aqui */}
        <span style={{
          color: "#fff",
          fontSize: "0.95rem",
          fontStyle: "italic",
          textAlign: "center"
        }}>
          You already have a account? <span style={{ textDecoration: "underline", cursor: "pointer" }}>Login here!</span>
        </span>
      </form>
    </div>
  );
};

export default Register;