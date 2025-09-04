import React, { useState } from "react";

const ColorPickerModal = ({ onSelectColor, onCancel }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color); 
  };

  const handleOkClick = () => {
    if (selectedColor) {
      onSelectColor(selectedColor);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      {/* Círculo das cores */}
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "6px",
          background: "#222",
          marginBottom: "20px",
        }}
      >
        {selectedColor ? (
          <div
            style={{
              background: selectedColor,
              gridColumn: "1 / span 2",
              gridRow: "1 / span 2",
            }}
          />
        ) : (
          <>
            <div
              onClick={() => handleColorClick("#E2B633")}
              role="button"
              tabIndex={0}
              style={{ background: "#E2B633", cursor: "pointer", outline: "none" }}
            />
            <div
              onClick={() => handleColorClick("#8CB028")}
              role="button"
              tabIndex={0}
              style={{ background: "#8CB028", cursor: "pointer", outline: "none" }}
            />
            <div
              onClick={() => handleColorClick("#6CA3D2")}
              role="button"
              tabIndex={0}
              style={{ background: "#6CA3D2", cursor: "pointer", outline: "none" }}
            />
            <div
              onClick={() => handleColorClick("#C93827")}
              role="button"
              tabIndex={0}
              style={{ background: "#C93827", cursor: "pointer", outline: "none" }}
            />
          </>
        )}

        {!selectedColor && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#222",
              color: "#fff",
              padding: "40px 30px",
              borderRadius: "20px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            CHOOSE A COLOR
          </div>
        )}
      </div>

      {/* Botão OK */}
      <button
        onClick={handleOkClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          border: "none",
          cursor: selectedColor ? "pointer" : "not-allowed",
          background: selectedColor ? "#4CAF50" : "#555",
          color: "#fff",
        }}
        disabled={!selectedColor} 
      >
        OK
      </button>

    </div>
  );
};

export default ColorPickerModal;
