import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const tracks = [
    { id: 1, title: 'DEPOIMENTO: DR. CARLOS LEMOS', date: '13-11-2009', file: '/audio/Dr. Carlos Lemos — Depoimento 2009.mp3', type: 'INQUÉRITO', locked: false },
    { id: 2, title: 'DEPOIMENTO: MARCELO SOUZA', date: '14-11-2009', file: '/audio/Marcelo Souza — Depoimento 2009.mp3', type: 'INQUÉRITO', locked: false },
    { id: 3, title: 'DEPOIMENTO: ROBERTO ALVES (GRAXA)', date: '15-11-2009', file: '/audio/Beto Graxa — Depoimento 2009.mp3', type: 'INQUÉRITO', locked: false },
    { id: 4, title: 'DEPOIMENTO: LÚCIA FERNANDES', date: '15-11-2009', file: '/audio/Lúcia Fernandes — Depoimento 2009.mp3', type: 'INQUÉRITO', locked: false },
    { id: 5, title: 'RE-INQUIRIÇÃO: LÚCIA FERNANDES', date: '04-11-2024', file: '/audio/Lúcia Fernandes — Depoimento 2024.mp3', type: 'REABERTURA', locked: false },
    { id: 6, title: 'RE-INQUIRIÇÃO: MARCELO SOUZA', date: '05-11-2024', file: '/audio/Marcelo Souza — Depoimento 2024.mp3', type: 'REABERTURA', locked: false },
    { id: 7, title: 'RE-INQUIRIÇÃO: DR. CARLOS LEMOS', date: '06-11-2024', file: '/audio/Dr. Carlos Lemos — Depoimento 2024.mp3', type: 'REABERTURA', locked: false },
    { id: 8, title: 'ESCUTA: INTERCEPTAÇÃO TELEFÔNICA (LEMOS)', date: '12-11-2024', file: '/audio/Confissão Final — Dr. Carlos Lemos (Ato 5).mp3', type: 'CONFIDENCIAL', locked: true }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [activeTrack]);

  const selectTrack = (track) => {
    if (track.locked && !unlocked) return;
    setActiveTrack(track);
    setIsPlaying(false);
  };

  const handleUnlock = () => {
    // A senha é baseada no ato final. Se o jogador descobrir q é LEMOS.
    if (passwordInput.toUpperCase() === 'LEMOS') {
      setUnlocked(true);
      setPasswordInput('');
    } else {
      alert("ACESSO NEGADO: CHAVE INCOMPATÍVEL.");
    }
  };

  // Cria barras visuais baseadas no tempo
  const visualBars = Array.from({length: 20});

  return (
    <div className="player-container">
      <header>
        <div>
          <h1>SISTEMA DE ESCUTA</h1>
          <div className="system-id">DP17::DEPARTAMENTO_DE_POLÍCIA::PROJETO_CASO_FRIO</div>
        </div>
        <div>
          <img src="../../images/9.png" alt="Logo DP" width="60" style={{filter: 'grayscale(100%) brightness(200%)'}} />
        </div>
      </header>

      <main className="main-content">
        <div className="playlist">
          {tracks.map(track => (
            <div 
              key={track.id} 
              className={`track-item ${activeTrack?.id === track.id ? 'active' : ''} ${(track.locked && !unlocked) ? 'locked' : ''}`}
              onClick={() => selectTrack(track)}
            >
              <div className="track-info">
                <h3>{track.title}</h3>
                <p>STATUS: {track.type} | ID_AUTORIDADE: J.CARVALHO</p>
              </div>
              <div className="track-year">{track.date.split('-')[2]}</div>
            </div>
          ))}
        </div>

        <div className="active-player-panel">
          <div style={{color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: '100%'}}>
            {activeTrack ? `> CARREGANDO ARQUIVO: ${activeTrack.title}` : '> SELECIONE UMA GRAVAÇÃO...'}
            <br/>
            {activeTrack && `> DATA REG.: ${activeTrack.date}`}
          </div>

          <div className={`visualizer-mock ${isPlaying ? 'playing' : ''}`}>
            {visualBars.map((_, i) => (
              <div 
                key={i} 
                className="bar" 
                style={{
                  height: isPlaying ? `${Math.floor(Math.random() * 80) + 10}%` : '10%',
                  transitionDuration: `${Math.random() * 0.3 + 0.1}s`
                }}
              />
            ))}
          </div>

          <div className="player-controls">
            <audio 
              ref={audioRef} 
              src={activeTrack ? activeTrack.file : ''} 
              autoPlay 
              controls 
            />
          </div>

          {!unlocked && (
            <div className="locked-overlay">
              <p style={{color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem'}}>ARQUIVO 8 EXIGE OVERRIDE MESTRE</p>
              <input 
                type="text" 
                placeholder="INSIRA AUTORIA" 
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
              />
              <button onClick={handleUnlock}>DECRIPTAR</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
