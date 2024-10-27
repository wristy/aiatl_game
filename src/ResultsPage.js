import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { IconButton, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation } from 'react-router-dom';

function ResultsPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

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

    const url = 'http://0.0.0.0:5000';
    // const [currentState, setCurrentState] = useState(null);
    const [scoreOverTimeData, setScoreOverTimeData] = useState(null);
    const [scoreNiceness, setScoreNiceness] = useState(null);
    const [scoreForgiving, setScoreForgiving] = useState(null);
    const [scoreRetaliatory, setScoreRetaliatory] = useState(null);
    const [scoreTroublemaking, setScoreTroublemaking] = useState(null);
    const [scoreEmulative, setScoreEmulative] = useState(null);

    const [agent1scoreovertime, setAgent1ScoreOverTime] = useState([]);
    const [agent1niceness, setAgent1Niceness] = useState([]);
    const [agent1forgiving, setAgent1Forgiving] = useState([]);
    const [agent1retaliatory, setAgent1Retaliatory] = useState([]);
    const [agent1troublemaking, setAgent1Troublemaking] = useState([]);
    const [agent1emulative, setAgent1Emulative] = useState([]);

    const [agent2scoreovertime, setAgent2ScoreOverTime] = useState([]);
    const [agent2niceness, setAgent2Niceness] = useState([]);
    const [agent2forgiving, setAgent2Forgiving] = useState([]);
    const [agent2retaliatory, setAgent2Retaliatory] = useState([]);
    const [agent2troublemaking, setAgent2Troublemaking] = useState([]);
    const [agent2emulative, setAgent2Emulative] = useState([]);
    // const [agentDecisions, setAgentDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Log all query parameters for verification
        for (let [key, value] of queryParams.entries()) {
            // console.log(`${key}: ${value}`);
        }
    }, []);
    
    const parseQueryParams = (param) => {
        const paramValue = queryParams.get(param);
        try {
            return paramValue ? JSON.parse(paramValue) : [];
        } catch (error) {
            console.error(`Error parsing ${param}:`, error);
            return [];
        }
    };

    const score1 = parseQueryParams('score1');
    const niceness1 = parseQueryParams('niceness1');
    // console.log(niceness1);
    const forgiveness1 = parseQueryParams('forgiveness1');
    const retaliatory1 = parseQueryParams('retaliatory1');
    const troublemaking1 = parseQueryParams('troublemaking1');
    const emulative1 = parseQueryParams('emulative1');

    const score2 = parseQueryParams('score2');
    const niceness2 = parseQueryParams('niceness2');
    const forgiveness2 = parseQueryParams('forgiveness2');
    const retaliatory2 = parseQueryParams('retaliatory2');
    const troublemaking2 = parseQueryParams('troublemaking2');
    const emulative2 = parseQueryParams('emulative2');

    useEffect(() => {
        // Fetch data from the backend API
        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/data_request`); // api call
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const history = data.history;
            const historyArray = Object.values(history);
            const roundNumbers = historyArray.map(round => round.round_number);
            const myTotalPoints = historyArray.map(round => round.my_total_points);
            // console.log(myTotalPoints);
            const partnerTotalPoints = historyArray.map(round => round.partner_total_points);

            // setCurrentState(data.current_state);
            setAgent1ScoreOverTime(score1)
            setAgent1Niceness(niceness1);
            console.log(niceness1);
            console.log(agent1niceness);
            setAgent1Forgiving(forgiveness1);
            setAgent1Retaliatory(retaliatory1);
            setAgent1Troublemaking(troublemaking1);
            setAgent1Emulative(emulative1);

            setAgent2ScoreOverTime(score2);
            setAgent2Niceness(niceness2);
            setAgent2Forgiving(forgiveness2);
            setAgent2Retaliatory(retaliatory2);
            setAgent2Troublemaking(troublemaking2);
            setAgent2Emulative(emulative2);

//            setScoreOverTimeData([{
//                x: roundNumbers,
//                y: myTotalPoints,
//                type: 'scatter',
//                mode: 'lines+markers',
//                marker: { color: '#AC5AF0' },
//                name: 'Agent 1'
//            },
//            {
//                x: roundNumbers,
//                y: partnerTotalPoints,
//                type: 'scatter',
//                mode: 'lines+markers',
//                marker: { color: '#F04A3E' },
//                name: 'Agent 2'
//            }
//            ]);

            // setScoreNiceness([{
            //     x: roundNumbers,
            //     y: agent1niceness,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#AC5AF0' },
            //     name: 'Agent 1'
            // },
            // {
            //     x: roundNumbers,
            //     y: agent2niceness,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#F04A3E' },
            //     name: 'Agent 2'
            // }
            // ]);

            // setScoreForgiving([{
            //     x: roundNumbers,
            //     y: agent1forgiving,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#AC5AF0' },
            //     name: 'Agent 1'
            // },
            // {
            //     x: roundNumbers,
            //     y: agent2forgiving,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#F04A3E' },
            //     name: 'Agent 2'
            // }
            // ]);

            // setScoreRetaliatory([{
            //     x: roundNumbers,
            //     y: agent1retaliatory,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#AC5AF0' },
            //     name: 'Agent 1'
            // },
            // {
            //     x: roundNumbers,
            //     y: agent2retaliatory,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#F04A3E' },
            //     name: 'Agent 2'
            // }
            // ]);

            // setScoreTroublemaking([{
            //     x: roundNumbers,
            //     y: agent1troublemaking,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#AC5AF0' },
            //     name: 'Agent 1'
            // },
            // {
            //     x: roundNumbers,
            //     y: agent2troublemaking,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#F04A3E' },
            //     name: 'Agent 2'
            // }
            // ]);

            // setScoreEmulative([{
            //     x: roundNumbers,
            //     y: agent1emulative,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#AC5AF0' },
            //     name: 'Agent 1'
            // },
            // {
            //     x: roundNumbers,
            //     y: agent2emulative,
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     marker: { color: '#F04A3E' },
            //     name: 'Agent 2'
            // }
            // ]);
            

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


    useEffect(() => {
        setScoreOverTimeData([
            {
                x: Array.from({ length: agent1scoreovertime.length }, (_, i) => i + 1), // Assuming rounds are sequential
                y: agent1scoreovertime,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Score'
            },
            {
                x: Array.from({ length: agent2scoreovertime.length }, (_, i) => i + 1),
                y: agent2scoreovertime,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Score'
            }
        ]);
    }, [agent1scoreovertime, agent2scoreovertime]);

    useEffect(() => {
        setScoreNiceness([
            {
                x: Array.from({ length: agent1niceness.length }, (_, i) => i + 1), // Assuming rounds are sequential
                y: agent1niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Niceness'
            },
            {
                x: Array.from({ length: agent2niceness.length }, (_, i) => i + 1),
                y: agent2niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Niceness'
            }
        ]);
    }, [agent1niceness, agent2niceness]);

    useEffect(() => {
        setScoreNiceness([
            {
                x: Array.from({ length: agent1niceness.length }, (_, i) => i + 1), // Assuming rounds are sequential
                y: agent1niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Niceness'
            },
            {
                x: Array.from({ length: agent2niceness.length }, (_, i) => i + 1),
                y: agent2niceness,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Niceness'
            }
        ]);
    }, [agent1niceness, agent2niceness]);

    useEffect(() => {
        setScoreForgiving([
            {
                x: Array.from({ length: agent1forgiving.length }, (_, i) => i + 1),
                y: agent1forgiving,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Forgiving'
            },
            {
                x: Array.from({ length: agent2forgiving.length }, (_, i) => i + 1),
                y: agent2forgiving,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Forgiving'
            }
        ]);
    }, [agent1forgiving, agent2forgiving]);

    useEffect(() => {
        setScoreRetaliatory([
            {
                x: Array.from({ length: agent1retaliatory.length }, (_, i) => i + 1),
                y: agent1retaliatory,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Retaliatory'
            },
            {
                x: Array.from({ length: agent2retaliatory.length }, (_, i) => i + 1),
                y: agent2retaliatory,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Retaliatory'
            }
        ]);
    }, [agent1retaliatory, agent2retaliatory]);

    useEffect(() => {
        setScoreTroublemaking([
            {
                x: Array.from({ length: agent1troublemaking.length }, (_, i) => i + 1),
                y: agent1troublemaking,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Troublemaking'
            },
            {
                x: Array.from({ length: agent2troublemaking.length }, (_, i) => i + 1),
                y: agent2troublemaking,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Troublemaking'
            }
        ]);
    }, [agent1troublemaking, agent2troublemaking]);

    useEffect(() => {
        setScoreEmulative([
            {
                x: Array.from({ length: agent1emulative.length }, (_, i) => i + 1),
                y: agent1emulative,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#AC5AF0' },
                name: 'Agent 1 Emulative'
            },
            {
                x: Array.from({ length: agent2emulative.length }, (_, i) => i + 1),
                y: agent2emulative,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: '#F04A3E' },
                name: 'Agent 2 Emulative'
            }
        ]);
    }, [agent1emulative, agent2emulative]);
    
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
