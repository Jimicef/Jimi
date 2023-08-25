import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import './App.css';


const messages = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
];


function App() {
  const [input, setInput] = React.useState("");
  const [jimi, setJimi] = React.useState([]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setJimi((existingJimi) => [...existingJimi, {text: input, sender: 'user'}])}
      //fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
      fetch(`http://jimi-bucket.s3-website.ap-northeast-2.amazonaws.com/api/qa`, {
        method: 'POST',
        body: JSON.stringify({
          question: input
        })
      })
      .then(response => response.json())
      .then(data => {
        setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
      }
      )
      setInput("")
    };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  React.useEffect(()=> {
    fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
      method: 'POST',
      body: JSON.stringify({
        question: '시작'
      })
    })
    .then(response => response.json())
    .then(data => {
      setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])}
    )
  }, [])

  return (
    <Box
      sx = {{
        display: 'flex',
        justifyContent: 'center'
      }}>
    <Box
      sx={{
        width: '50%',
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {jimi.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              size="small"
              fullWidth
              placeholder="Type a message"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Box>
  );
};

export default App;
