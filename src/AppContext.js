import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [metrics, setMetrics] = useState({
        niceness1: [],
        forgiveness1: [],
        retaliatory1: [],
        troublemaking1: [],
        emulative1: [],
        score1: [],
        niceness2: [],
        forgiveness2: [],
        retaliatory2: [],
        troublemaking2: [],
        emulative2: [],
        score2: [],
    });
    const [gameInitialized, setGameInitialized] = useState(false);
    const [agent1, setAgent1] = useState('sonnet');
    const [agent2, setAgent2] = useState('haiku');
    const [rounds, setRounds] = useState(10);
    const [player1History, setPlayer1History] = useState([]);
    const [player2History, setPlayer2History] = useState([]);
    const [error, setError] = useState(false);

    return (
        <AppContext.Provider
            value={{
                metrics,
                setMetrics,
                gameInitialized,
                setGameInitialized,
                agent1,
                setAgent1,
                agent2,
                setAgent2,
                rounds,
                setRounds,
                player1History,
                setPlayer1History,
                player2History,
                setPlayer2History,
                error,
                setError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use context
export const useAppContext = () => {
    return useContext(AppContext);
};