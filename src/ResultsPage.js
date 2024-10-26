import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { IconButton } from '@mui/material';
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
    const [scoreDisparityData, setScoreDisparityData] = useState(null);
    const [agentDecisions, setAgentDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend API
        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/data_request`); // api call
            const history = response.data.history;
            const roundNumbers = history.map(round => round.round_number);
            const myTotalPoints = history.map(round => round.my_total_points);
            const partnerTotalPoints = history.map(round => round.partner_total_points);
            
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

            setScoreDisparityData({
            x: roundNumbers,
            y: myTotalPoints.map((points, index) => points - partnerTotalPoints[index]),
            type: 'bar',
            marker: { color: '#AC5AF0' },
            });

            setAgentDecisions(response.data.agentDecisions);

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
                <h1 style={{ color: 'white', textAlign: 'left', marginLeft: '10%' }}><code>LLM: Results</code></h1>
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
                <div style={{ marginBottom: '1%' }}>
                    {/* <h3 style={{color: 'white'}}>Score over time</h3> */}
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
                    {/* <h3 style={{color: 'white'}}>Score Disparity</h3> */}
                        {scoreDisparityData && (
                        <Plot
                            data={[scoreDisparityData]}
                            layout={{ width: '100%', 
                                    height: '100%', 
                                    title: 'Score Disparity',
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
                                    },
                        }}/>
                        )}
                </div>

                <div style={{marginBottom: '1%'}}>
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
                </div>
                </>
            )} 
        </div>
    );
}

export default ResultsPage;
