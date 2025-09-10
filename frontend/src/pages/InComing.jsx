import React from "react";

function InComing() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚧 Page Under Maintenance 🚧</h1>
      <p style={styles.text}>
        This section is still under development. Please check back later! (Access the Postman to progress)
      </p>
      <div style={styles.icon}>🛠️</div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#232323ff",
    color: "#b7b7b7ff",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "30px",
  },
  icon: {
    fontSize: "5rem",
  },
};

export default InComing;
