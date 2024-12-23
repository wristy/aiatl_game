import { React, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Box, MenuItem, Typography, TextField, Button } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './App.css';
import { useAppContext } from './AppContext'; // Import the context

function HomePage() {
    const {
        metrics, setMetrics,
        gameInitialized, setGameInitialized,
        agent1, setAgent1,
        agent2, setAgent2,
        rounds, setRounds,
        player1History, setPlayer1History,
        player2History, setPlayer2History,
        error, setError,
    } = useAppContext();

    const WhiteArrowDropDownIcon = styled(ArrowDropDownIcon)({
        color: 'white',
    });

    const url = 'http://0.0.0.0:5000';
    const boxRef = useRef(null);

    const options = [
        { value: "sonnet", label: "Sonnet" },
        { value: "haiku", label: "Haiku" },
        { value: "gemini", label: "Gemini" },
    ];


    const navigate = useNavigate();
    const handleResultsClick = () => {
        console.log("game_initialize:" + gameInitialized);
        const queryParams = new URLSearchParams();
        Object.keys(metrics).forEach(key => {
            queryParams.append(key, JSON.stringify(metrics[key]));
        });
        navigate(`/results?${queryParams.toString()}`);
    };

    useEffect(() => {
        if (!gameInitialized) return;

        const fetchPlayer1History = async () => {
            try {
                const response = await fetch(`${url}/data_request`,{
                    method: 'GET',}
                );
                const data = await response.json();
                if (response.ok) {
                  if (data.hasOwnProperty('message')) {
                    if (data.message === "FINISHED") {
                        console.log("Game finished");
                        setGameInitialized(false);
                        return;
                    }
                }
                    setMetrics(prevMetrics => ({
                        ...prevMetrics,
                        niceness1: [...prevMetrics.niceness1, data.agent1_niceness],
                        forgiveness1: [...prevMetrics.forgiveness1, data.agent1_forgiveness],
                        retaliatory1: [...prevMetrics.retaliatory1, data.agent1_retaliation],
                        troublemaking1: [...prevMetrics.troublemaking1, data.agent1_troublemaking],
                        emulative1: [...prevMetrics.emulative1, data.agent1_mimicry],
                        score1: [...prevMetrics.score1, data.agent1_score],
                    }));
                } else {
                    console.error('Error fetching data:', data.error);
                }

                const json_data = JSON.parse(data['history']).player1;
                const p1_data = JSON.parse(json_data[json_data.length - 1]);
                setPlayer1History(prevHistory => prevHistory + "\n\nRound " + data.round_number + "----------------------------------\n" + "Player 1 chose to " + p1_data.action + ".\n\nReasoning: " + p1_data.reasoning);
            } catch (error) {
                console.error('Error fetching player1 history:', error);
            }
        };

        fetchPlayer1History(); // Initial fetch
        const intervalId = setInterval(fetchPlayer1History, 5000); // Fetch every 10 seconds

        // Cleanup function to clear the interval
        return () => {
            clearInterval(intervalId);
        };
    }, [gameInitialized]);

    useEffect(() => {
        if (!gameInitialized) return;

        const fetchPlayer2History = async () => {
            try {
                const response = await fetch(`${url}/data_request`,{
                    method: 'GET',}
                );
                const data = await response.json();
                if (response.ok) {
                    if (data.hasOwnProperty('message')) {
                        if (data.message === "FINISHED") {
                            console.log("Game finished");
//                            setGameInitialized(false);
                            return;
                        }
                    }
                    setMetrics(prevMetrics => ({
                        ...prevMetrics,
                        niceness2: [...prevMetrics.niceness2, data.agent2_niceness],
                        forgiveness2: [...prevMetrics.forgiveness2, data.agent2_forgiveness],
                        retaliatory2: [...prevMetrics.retaliatory2, data.agent2_retaliation],
                        troublemaking2: [...prevMetrics.troublemaking2, data.agent2_troublemaking],
                        emulative2: [...prevMetrics.emulative2, data.agent2_mimicry],
                        score2: [...prevMetrics.score2, data.agent2_score],
                    }));
                } else {
                    console.error('Error fetching data:', data.error);
                }
                const json_data = JSON.parse(data['history']).player2;
                const p2_data = JSON.parse(json_data[json_data.length - 1]);
                setPlayer2History(prevHistory => prevHistory + "\n\nRound " + data.round_number + "----------------------------------\n" + "Player 2 chose to " + p2_data.action + ".\n\nReasoning: " + p2_data.reasoning);
            } catch (error) {
                console.error('Error fetching player1 history:', error);
            }
        };

        fetchPlayer2History(); // Initial fetch
        let intervalId;
        if (gameInitialized) {
            intervalId = setInterval(fetchPlayer2History, 5000); // Fetch every 10 seconds
        }

        // Cleanup function to clear the interval
        return () => {
            clearInterval(intervalId);
        };
    }, [gameInitialized]);

    const handleAgent1Change = (event) => {
        setAgent1(event.target.value);
    };    

    const handleAgent2Change = (event) => {
        setAgent2(event.target.value);
    };

    const handleRoundChange = (event) => {
        const inputValue = event.target.value;
        
        // Check if the input is an integer
        if (/^\d*$/.test(inputValue)) { // Only allow digits (no decimal point)
          setRounds(inputValue);
          setError(false);
        } else {
          setError(true); // Set error state if the input is not an integer
        }
    };

    const onPlay = () => {
        const data = {
            agent1: agent1,
            agent2: agent2,
            rounds: rounds,
        };
        setPlayer1History("");
        setPlayer2History("");


        setGameInitialized(true);
        fetch(`${url}/play`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .catch(error => {
                console.error('Error submitting data:', error);
            });
    };



    useEffect(() => {
        // This will scroll the box to the bottom whenever `messages` changes
        if (boxRef.current) {
            boxRef.current.scrollTo({
                top: boxRef.current.scrollHeight,
                behavior: "smooth" // Adds smooth scrolling to the bottom
            });
        }
    }, [player1History, player2History]);

    return (
        <Box className="full-viewport" sx={{height: '100vh'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <h1 style={{color: 'white', textAlign: 'left', marginLeft: '10%' }}><code>AgentArena</code></h1>
            <Box sx={{display: 'flex', flex: 1}}></Box>
            <Button variant="primary" 
                        sx={{
                            backgroundColor: '#00FF81',
                            // maxWidth: '10px',
                            height: '100%',
                            marginRight: '10%'}}
                        onClick={onPlay}
            >
                <PlayArrowIcon />
            </Button>
            </Box>
            {/* select models and no. of rounds */ }
            <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                // gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                mx: '10%',
            }}>
                <Select 
                    defaultValue={agent1}
                    onChange={handleAgent1Change} 
                    displayEmpty
                    IconComponent={WhiteArrowDropDownIcon}
                    sx = {{color: 'white',
                           backgroundColor: '#2b2340',
                        //    outlineColor: 'white'
                    }}
                >
                    {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </Select>
                <Box
                    sx={{display: 'flex',
                        flex: '1',
                    flexDirection: 'row',
                    }}
                ></Box>
                {/* <Box
                    sx={{display: 'flex',
                        flex: '1',
                    flexDirection: 'row',
                    }}
                > */}
                    <TextField
                    value={rounds}
                    onChange={handleRoundChange}
                    id="standard-number"
                    label="Number of rounds"
                    type="number"
                    variant="standard"
                    error={error}
                    helperText={error ? "Only integers are allowed" : ""}
                    slotProps={{
                        inputLabel: {
                        shrink: true,
                        },
                    }}
                    sx={{
                        // Styles for the label
                        '& .MuiInputLabel-root': {
                          color: 'white',
                        },
                        // Styles for the input text
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                        // Styles for the helper text
                        '& .MuiFormHelperText-root': {
                          color: 'white',
                        },
                        '& .MuiInput-underline:before': {
                        borderBottomColor: 'white', // Default state
                        },
                        '& .MuiInput-underline:after': {
                        borderBottomColor: 'white', // Focused state
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: 'white', // Hover state
                        },
                      }}
                    />
                {/* </Box> */}
                <Box
                    sx={{display: 'flex',
                        flex: '1',
                        flexDirection: 'row',
                    }}
                ></Box>
                <Select 
                    defaultValue={agent2} 
                    onChange={handleAgent2Change} 
                    displayEmpty
                    IconComponent={WhiteArrowDropDownIcon}
                    sx = {{color: 'white',
                           backgroundColor: '#2b2340'
                    }}
                >
                    {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </Select> 

            {/* agent train of thought + decision  */}    
            </Box>
            <Box
            ref={boxRef}
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                // gap: '10px',
                alignItems: 'top',
                justifyContent: 'center',
                minHeight: '70vh',
                mx: '10%',
                my: '1%'
            }}>
                {/* {loading ? (
                    <CircularProgress />
                ) : ( */}
                    <Typography variant="body2"
                    ref={boxRef}
                    sx={{
                        fontSize: '12px',
                        color: 'white',
                        fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                        backgroundColor: '#333',
                        padding: '4px',
                        borderRadius: '4px',
                        minWidth: '40%',
                        maxWidth: '40%',
                        maxHeight: '70vh',
                        textAlign: 'left',
                        overflowY: 'auto',        // Enables vertical scrolling when content overflows
                        overflowX: 'hidden',      // Hides horizontal overflow if text wraps
                        whiteSpace: 'pre-wrap',
                    }}>
                    {player1History}
                    </Typography>
                <Box
                    sx={{display: 'flex',
                        flex: '1',
                    flexDirection: 'row',
                    }}
                ></Box>
                {/* {loading ? (
                    <CircularProgress />
                ) : ( */}
                    <Typography variant="body2"
                    ref={boxRef}
                    sx={{
                        fontSize: '12px',
                        color: 'white',
                        fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                        backgroundColor: '#333',
                        padding: '4px',
                        borderRadius: '4px',
                        minWidth: '40%',
                        maxWidth: '40%',
                        maxHeight: '70vh',
                        textAlign: 'left',
                        overflowY: 'auto',        // Enables vertical scrolling when content overflows
                        overflowX: 'hidden',      // Hides horizontal overflow if text wraps
                        whiteSpace: 'pre-wrap',
                    }}>
                    {player2History} 
                    </Typography>
            </Box>
            <Box
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                maxHeight: '5%',
                mx: '10%',
                my: '1%'
            }}>
                <Button 
                    variant="secondary" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleResultsClick}
                    sx={{color: 'white'}} >
                    Results
                </ Button>
            </Box>
        </Box>
    );
}

export default HomePage;