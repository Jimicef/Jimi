import React from 'react'
import { Box, Button, Card } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Box
                sx = {{
                    height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
        <Card
        sx={{
            width: ['100%', '100%', '820px'],
            height: "760px",
            display: "flex",
            flexDirection: "column",
            bgcolor: "grey.200",
            overflow: "auto"
        }}
        > 
        <Button variant='contained' onClick={()=>navigate('/voice')}>음성 지원 기능</Button>
        <Button variant="contained" onClick={()=>navigate('/nonvoice')}>일반 텍스트</Button>
        </Card>
    </Box>
        </div>
    )
}

export default Landing