import React from 'react'
import { Box, Button, Card, Avatar, Typography } from "@mui/material";


const BasicCard = (props) => {
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
            height: ['100%', '100%', '760px'],
            display: "flex",
            flexDirection: "column",
            bgcolor: "grey.200",
            overflow: "auto",
        }}
        > 
            {props.children}
        </Card>
    </Box>
        </div>
  )
}

export default BasicCard