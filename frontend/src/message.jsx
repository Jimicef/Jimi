import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper} from "@mui/material";

export const Message = ({ message }) => {
    const isBot = message.sender === "bot";
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isBot ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isBot ? "row" : "row-reverse",
            alignItems: "flex-end",
          }}
        >
          {isBot && 
            <Avatar sx={{ bgcolor: "#8977AD" }}>
              B
            </Avatar>
          }
          <Paper
            variant="outlined"
            sx={{
              width: '50%',
              p: 2,
              ml: isBot ? 1 : 0,
              mr: isBot ? 0 : 1,
              backgroundColor: isBot ? "white" : "#BDA4D5",
              borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Paper>
        </Box>
      </Box>
    );
  };