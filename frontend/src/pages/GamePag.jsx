import React, { useEffect, useState } from 'react';


const mockPlayers = [
  { id: 1, name: 'Player Name', cards: 10, position: 'left' },
  { id: 2, name: 'Player Name', cards: 7, position: 'top' },
  { id: 3, name: 'Player Name', cards: 6, position: 'right' },
];

// Cartas mais diversificadas
const mockMyCards = [
  { id: 1, color: 'blue', value: '1' },
  { id: 2, color: 'red', value: '3' },
  { id: 3, color: 'green', value: '7' },
  { id: 4, color: 'yellow', value: '9' },
  { id: 5, color: 'blue', value: 'skip' },
  { id: 6, color: 'red', value: 'reverse' },
  { id: 7, color: 'black', value: 'wild' },
  { id: 8, color: 'green', value: '+2' },
  { id: 9, color: 'yellow', value: '0' },
];

const mockTableCard = { color: 'yellow', value: 'skip' };
const mockDeckCount = 32;

function GamePag() {
  const [myName, setMyName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    
    const playerId = localStorage.getItem("playerId") || "1"; // fallback id=1

    // Requisição para buscar os dados do player
    fetch(`/api/players/${playerId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar player");
        }
        return res.json();
      })
      .then((data) => {
        setMyName(data.name || "Player");
      })
      .catch((err) => {
        console.error("Erro:", err);
        setMyName("Player"); // fallback
      });
  }, []);

  const handleLeave = () => setShowConfirm(true);
  const confirmLeave = () => {
    setShowConfirm(false);
    console.log('Leaving game...');
  };
  const cancelLeave = () => setShowConfirm(false);

  return (
    <div style={{
      background: '#222',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      position: 'relative',
      padding: '0',
      overflow: 'hidden'
    }}>
      {/* Jogadores */}
      <div style={{ position: 'absolute', left: 40, top: '40%', textAlign: 'center' }}>
        <div>{mockPlayers[0].name}</div>
        <div style={{ fontSize: 24 }}>{mockPlayers[0].cards} CARDS</div>
        <UnoCardBack size={70} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 40, transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div>{mockPlayers[1].name}</div>
        <div style={{ fontSize: 24 }}>{mockPlayers[1].cards} CARDS</div>
        <UnoCardBack size={70} />
      </div>
      <div style={{ position: 'absolute', right: 40, top: '40%', textAlign: 'center' }}>
        <div>{mockPlayers[2].name}</div>
        <div style={{ fontSize: 24 }}>{mockPlayers[2].cards} CARDS</div>
        <UnoCardBack size={70} />
      </div>

      {/* Deck para comprar */}
      <div style={{
        position: 'absolute',
        left: 40,
        bottom: 40,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 22 }}>{mockDeckCount} LEFT</div>
        <div style={{ cursor: 'pointer' }}>
          <UnoCardBack size={70} />
        </div>
        <div style={{ fontSize: 18 }}>TAKE ONE</div>
      </div>

      {/* Carta da mesa */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <UnoCard card={mockTableCard} size={110} />
      </div>

      {/* Minhas cartas */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 80,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10
      }}>
        {mockMyCards.map(card => (
          <UnoCard key={card.id} card={card} size={70} hoverable={true} />
        ))}
      </div>
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 30,
        transform: 'translateX(-50%)',
        fontSize: 32
      }}>
        {myName}
      </div>

      {/* Botão Leave */}
      <button
        style={{
          position: 'absolute',
          right: 40,
          bottom: 30,
          background: '#c0392b',
          color: '#fff',
          border: 'none',
          borderRadius: 30,
          padding: '16px 40px',
          fontSize: 28,
          cursor: 'pointer',
          fontFamily: 'Montserrat, sans-serif',
          boxShadow: '0 2px 8px #0006',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#a93226';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px #0008';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#c0392b';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 2px 8px #0006';
        }}
        onClick={handleLeave}
      >
        LEAVE
      </button>

      {/* Balão de confirmação */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          left: 0, top: 0, width: '100vw', height: '100vh',
          background: '#000a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#222',
            padding: 40,
            borderRadius: 20,
            boxShadow: '0 2px 16px #000a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, marginBottom: 20 }}>Tem certeza que deseja sair da sala?</div>
            <button
              style={{
                background: '#c0392b',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '12px 32px',
                fontSize: 20,
                marginRight: 20,
                cursor: 'pointer'
              }}
              onClick={confirmLeave}
            >Sim</button>
            <button
              style={{
                background: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '12px 32px',
                fontSize: 20,
                cursor: 'pointer'
              }}
              onClick={cancelLeave}
            >Não</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para carta do verso (com logo UNO)
function UnoCardBack({ size = 70 }) {
  return (
    <div style={{
      width: size,
      height: size * 1.4,
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: '2px solid #333'
    }}>
      <div style={{
        width: size * 0.7,
        height: size * 0.5,
        backgroundImage: 'url("/Uno Logo.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }} />
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        height: 6,
        background: 'linear-gradient(to right, #27ae60, #3498db, #e74c3c, #f1c40f)',
        borderRadius: 3
      }} />
    </div>
  );
}

// Componente para renderizar carta UNO
function UnoCard({ card, size = 70, hoverable = false }) {
  const colors = {
    blue: '#3498db',
    yellow: '#f1c40f',
    black: '#222',
    red: '#e74c3c',
    green: '#27ae60'
  };

  const getSymbol = (value) => {
    switch (value) {
      case 'wild': return '●';
      case 'skip': return '⦸';
      case 'reverse': return '↻';
      case '+2': return '+2';
      case '+4': return '+4';
      default: return value;
    }
  };

  return (
    <div
      style={{
        width: size,
        height: size * 1.4,
        background: colors[card.color] || '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        color: card.color === 'black' ? '#fff' : '#222',
        position: 'relative',
        cursor: hoverable ? 'pointer' : 'default',
        transition: hoverable ? 'all 0.3s ease' : 'none',
        border: `3px solid ${card.color === 'black' ? '#444' : 'rgba(0,0,0,0.2)'}`
      }}
      onMouseEnter={hoverable ? (e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.6)';
        e.currentTarget.style.zIndex = '10';
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
        e.currentTarget.style.zIndex = '1';
      } : undefined}
    >
      <span style={{
        fontWeight: 'bold',
        textShadow: card.color === 'black' ? 'none' : '1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        {getSymbol(card.value)}
      </span>

      <div style={{
        position: 'absolute',
        top: 4,
        left: 4,
        fontSize: size * 0.15,
        fontWeight: 'bold'
      }}>
        {getSymbol(card.value)}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 4,
        right: 4,
        fontSize: size * 0.15,
        fontWeight: 'bold',
        transform: 'rotate(180deg)'
      }}>
        {getSymbol(card.value)}
      </div>
    </div>
  );
}

export default GamePag;
