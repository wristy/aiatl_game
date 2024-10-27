import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { IconButton, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function ResultsPage() {
    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate('/');
    };

    // const scoreOverTimeData = [{
    //     x: [1, 2, 3, 4, 5],
    //     y: [10, 15, 13, 17, 19],
    //     type: 'scatter',
    //     mode: 'lines+markers',
    //     marker: { color: '#AC5AF0' },
    //     name: 'Agent 1'
    // },
    // {
    //     x: [1, 2, 3, 4, 5],
    //     y: [4, 14, 19, 14, 29],
    //     type: 'scatter',
    //     mode: 'lines+markers',
    //     marker: { color: '#F04A3E' }, 
    //     name: 'Agent 2'
    // }];

    // const scoreDisparityData = {
    //     x: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    //     y: [2, 3, 5, 7, 11, 1, 2, 3, 4, 5],
    //     type: 'bar',
    //     marker: { color: '#AC5AF0' },
    // };

    // const agentDecisions = [
    //     { id: "Sonnet", decisions: [true, false, true, true, false] },
    //     { id: "Gemini", decisions: [false, true, false, true, true] },
    // ];

    const url = 'http://localhost:5000';
    const [scoreOverTimeData, setScoreOverTimeData] = useState(null);
    const [scoreNiceness, setScoreNiceness] = useState(null);
    const [scoreForgiving, setScoreForgiving] = useState(null);
    const [scoreRetaliatory, setScoreRetaliatory] = useState(null);
    const [scoreTroublemaking, setScoreTroublemaking] = useState(null);
    const [scoreEmulative, setScoreEmulative] = useState(null);

    const [agent1niceness, setAgent1Niceness] = useState(0);
    const [agent1forgiving, setAgent1Forgiving] = useState(0);
    const [agent1retaliatory, setAgent1Retaliatory] = useState(0);
    const [agent1troublemaking, setAgent1Troublemaking] = useState(0);
    const [agent1emulative, setAgent1Emulative] = useState(0);

    const [agent2niceness, setAgent2Niceness] = useState(0);
    const [agent2forgiving, setAgent2Forgiving] = useState(0);
    const [agent2retaliatory, setAgent2Retaliatory] = useState(0);
    const [agent2troublemaking, setAgent2Troublemaking] = useState(0);
    const [agent2emulative, setAgent2Emulative] = useState(0);
    // const [agentDecisions, setAgentDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend API
        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/data_request`); // api call
            const history = response.data.history;
            const historyArray = Object.values(history);
            const roundNumbers = historyArray.map(round => round.round_number);
            const myTotalPoints = historyArray.map(round => round.my_total_points);
            const partnerTotalPoints = historyArray.map(round => round.partner_total_points);

            const currentState = response.data.current_state;
            setAgent1Niceness(currentState.agent1_niceness);
            setAgent1Forgiving(currentState.agent1_forgiveness);
            setAgent1Retaliatory(currentState.agent1_retaliation);
            setAgent1Troublemaking(currentState.agent1_troublemaking);
            setAgent1Emulative(currentState.agent1_mimicry);

            setAgent2Niceness(currentState.agent2_niceness);
            setAgent2Forgiving(currentState.agent2_forgiveness);
            setAgent2Retaliatory(currentState.agent2_retaliation);
            setAgent2Troublemaking(currentState.agent2_troublemaking);
            setAgent2Emulative(currentState.agent2_mimicry);

            setScoreOverTimeData([{
                x: roundNumbers,
                y: myTotalPoints,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: partnerTotalPoints,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            setScoreNiceness([{
                x: roundNumbers,
                y: agent1niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: agent2niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            setScoreForgiving([{
                x: roundNumbers,
                y: agent1forgiving,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: agent2forgiving,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            setScoreRetaliatory([{
                x: roundNumbers,
                y: agent1retaliatory,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: agent2retaliatory,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            setScoreTroublemaking([{
                x: roundNumbers,
                y: agent1troublemaking,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: agent2troublemaking,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            setScoreEmulative([{
                x: roundNumbers,
                y: agent1emulative,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1'
            },
            {
                x: roundNumbers,
                y: agent2emulative,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2'
            }
            ]);

            // setAgentDecisions(response.data.agentDecisions);

            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                <h1 style={{ color: 'white', textAlign: 'left', marginLeft: '10%' }}><code>AgentArena: Results</code></h1>
                <div style={{display: 'flex', flex: 1}}></div>
                <IconButton 
                    onClick={handleHomeClick}
                    sx={{marginRight: '10%'}}>
                    <ArrowBackIosNewIcon sx={{color: 'white'}}/>
                </IconButton>
            </div>
            {loading ? (
                <p style={{ color: 'white' }}>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}><code>{error}</code></p>
            ) : (
                <>
                <Box sx={{display: 'flex', flex: 1, flexDirection: "row", mx: '3%'}}>
                <div style={{ marginBottom: '1%' }}>
                        {scoreOverTimeData && (
                        <Plot
                            data={scoreOverTimeData}
                            layout={{ width: '100%', 
                                    height: '100%', 
                                    title: 'Score over time',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    } 
                        }}/>
                        )}
                </div>

                <div style={{ marginBottom: '1%' }}>
                        {scoreNiceness && (
                        <Plot
                            data={scoreNiceness}
                            layout={{ width: '100%', 
                                    height: '100%', 
                                    title: 'Niceness',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    } 
                        }}/>
                        )}
                </div>
                </Box>

                <Box sx={{display: 'flex', flex: 1, flexDirection: "row", mx: '3%'}}>
                <div style={{ marginBottom: '1%' }}>
                        {scoreForgiving && (
                        <Plot
                            data={scoreForgiving}
                            layout={{ width: '100%',
                                    height: '100%',
                                    title: 'Forgiving',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    }
                            }}
                        />
                        )}
                </div>

                <div style={{ marginBottom: '1%' }}>
                        {scoreRetaliatory && (
                        <Plot
                            data={scoreRetaliatory}
                            layout={{ width: '100%',
                                    height: '100%',
                                    title: 'Retaliatory',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    }
                            }}
                        />
                        )}
                </div>
                </Box>

                <Box sx={{display: 'flex', flex: 1, flexDirection: "row", mx: '3%'}}>
                <div style={{ marginBottom: '1%' }}>
                        {scoreTroublemaking && (
                        <Plot
                            data={scoreTroublemaking}
                            layout={{ width: '100%',
                                    height: '100%',
                                    title: 'Troublemaking',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    }
                            }}
                        />
                        )}
                </div>

                <div style={{ marginBottom: '1%' }}>
                        {scoreEmulative && (
                        <Plot
                            data={scoreEmulative}
                            layout={{ width: '100%',
                                    height: '100%',
                                    title: 'Emulative',
                                    plot_bgcolor: 'transparent',
                                    paper_bgcolor: 'transparent',
                                    font: {
                                        color: 'white'
                                    },
                                    xaxis: {
                                        color: 'white'
                                    },
                                    yaxis: {
                                        color: 'white'
                                    }
                            }}
                        />
                        )}
                </div>
                </Box>


                {/* <div style={{marginBottom: '1%'}}>
                    <h3 style={{color: 'white'}}>Agent Decisions</h3>
                    {agentDecisions.map(agent => (
                    <div key={agent.id} style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'flex'}}>
                        <div style={{color: 'white', marginRight: '10px', fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',}}>{agent.id}:</div>
                        {agent.decisions.map((decision, index) => (
                            <div
                                key={index}
                                style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: decision ? '#00FF81' : '#F04A3E',
                                margin: '2px',
                                borderRadius: '4px',
                                }}
                            />
                        ))}
                    </div>
                    ))}
                </div> */}
                </>
            )} 
        </div>
    );
}

export default ResultsPage;
