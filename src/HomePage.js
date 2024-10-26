import { React, useEffect, useState } from 'react';
import { Select, Box, MenuItem, Typography, CircularProgress } from "@mui/material";
// import { Box } from "@mui/material/Box";

function HomePage() {
    const options = [
        { value: "Sonnet", label: "Sonnet" },
        { value: "Haiku", label: "Haiku" },
        { value: "Gemini", label: "Gemini" },
    ];
      
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchText = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch('https://api.example.com/generate-text');
                const data = await response.json();
                setText(data.text);
            } catch (error) {
                console.error('Error fetching text:', error);
                setText('Failed to load text');
            } finally {
                setLoading(false);
            }
        };
    
        fetchText();
    }, []);

    const onChange = (value) => {
        console.log(value);
    };

    return (
        <div>
            <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                // gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                mx: '10%',
            }}>
                <Select defaultValue="Sonnet" onChange={onChange} displayEmpty>
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
                >
                    
                </Box>
                <Select defaultValue="Sonnet" onChange={onChange} displayEmpty>
                    {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </Select> 

                    
            </Box>
            <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                // gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                mx: '10%',
                my: '1%'
            }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Typography variant="body2" sx={{ fontSize: '18px', color: 'text.primary' }}>
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
                    <Typography variant="body2" sx={{ fontSize: '18px', color: 'text.primary' }}>
                    {text}
                    </Typography>
                )}
            </Box>
        </div>
    );
}

export default HomePage;