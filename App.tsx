
import React, { useState, useEffect, useCallback } from 'react';
import { Team, Scores, Victories } from './types';
import { MAX_SCORE, TEAMS } from './constants';
import TeamPanel from './components/TeamPanel';
import VictoryDisplay from './components/VictoryDisplay';
import WinnerModal from './components/WinnerModal';
import { ResetIcon } from './components/icons/ResetIcon';

const App: React.FC = () => {
  const [scores, setScores] = useState<Scores>({ nos: 0, eles: 0 });
  const [victories, setVictories] = useState<Victories>({ nos: 0, eles: 0 });
  const [matchWinner, setMatchWinner] = useState<Team | null>(null);

  useEffect(() => {
    if (matchWinner) return;

    if (scores.nos >= MAX_SCORE) {
      setMatchWinner('nos');
      setVictories(prev => ({ ...prev, nos: prev.nos + 1 }));
    } else if (scores.eles >= MAX_SCORE) {
      setMatchWinner('eles');
      setVictories(prev => ({ ...prev, eles: prev.eles + 1 }));
    }
  }, [scores, matchWinner]);

  const handleAddPoints = useCallback((team: Team, points: number) => {
    if (matchWinner) return;
    setScores(prev => ({
      ...prev,
      [team]: Math.min(prev[team] + points, MAX_SCORE),
    }));
  }, [matchWinner]);

  const handleNewMatch = useCallback(() => {
    setScores({ nos: 0, eles: 0 });
    setMatchWinner(null);
  }, []);
  
  const handleResetAll = useCallback(() => {
    if (window.confirm("Tem certeza que deseja zerar o placar de vitórias e a partida atual?")) {
        setScores({ nos: 0, eles: 0 });
        setVictories({ nos: 0, eles: 0 });
        setMatchWinner(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-cyan-900">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Contador de Truco
          </h1>
          <p className="text-slate-400 mt-2">Marque os tentos da sua partida!</p>
        </header>

        <main className="mb-6">
          <VictoryDisplay victories={victories} />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamPanel
              teamId="nos"
              teamName={TEAMS.NOS}
              score={scores.nos}
              onAddPoints={handleAddPoints}
              disabled={!!matchWinner}
            />
            <TeamPanel
              teamId="eles"
              teamName={TEAMS.ELES}
              score={scores.eles}
              onAddPoints={handleAddPoints}
              disabled={!!matchWinner}
            />
          </div>
        </main>
        
        <footer className="text-center">
            <button
                onClick={handleResetAll}
                className="inline-flex items-center gap-2 bg-slate-700 hover:bg-red-800 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                aria-label="Zerar tudo"
                >
                <ResetIcon />
                Zerar Placar Geral
            </button>
        </footer>
      </div>

      {matchWinner && (
        <WinnerModal
          winnerName={TEAMS[matchWinner.toUpperCase() as keyof typeof TEAMS]}
          onNewMatch={handleNewMatch}
        />
      )}
    </div>
  );
};

export default App;
