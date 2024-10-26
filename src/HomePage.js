import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Box, MenuItem, Typography, CircularProgress, TextField, Button } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './App.css';
import axios from 'axios';
// import { Box } from "@mui/material/Box";

function HomePage() {
    const [agent1, setAgent1] = useState('Sonnet');
    const [agent2, setAgent2] = useState('Sonnet'); 
    const [rounds, setRounds] = useState(50);

    const options = [
        { value: "Sonnet", label: "Sonnet" },
        { value: "Haiku", label: "Haiku" },
        { value: "Gemini", label: "Gemini" },
    ];
      
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const handleResultsClick = () => {
        navigate('/results');
    };

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await fetch(``); // api call
                const data = await response.json();
                setText(data.text);
            } catch (error) {
                console.error('Error fetching text:', error);
                setText('Failed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load textFailed to load text');
            } finally {
                setLoading(false);
            }
        };
    
        fetchText();
    }, []);

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

    // const onAgentChange = (value) => {
    //     console.log(value);
    // };

    const onPlay = () => {
        const data = {
            agent1: agent1,
            agent2: agent2,
            rounds: rounds,
        };

        axios.post(``, data)
            .then(response => {
                console.log('Data submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });
    };

    return (
        <Box className="full-viewport" sx={{height: '100vh'}}>
            <h1 style={{color: 'white', textAlign: 'left', marginLeft: '10%' }}><code>LLM</code></h1>
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
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Typography variant="body2" sx={{ 
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
                    {text}
                    </Typography>
                )}
                <Box
                    sx={{display: 'flex',
                        flex: '1',
                    flexDirection: 'row',
                    }}
                ></Box>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Typography variant="body2" sx={{ 
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
                    {text}
                    </Typography>
                )}
            </Box>
            <Box sx={{
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