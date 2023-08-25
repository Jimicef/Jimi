import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import { useEffect, useRef } from "react";
import logo from './logo.png';
import './App.css';

const messages = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
];


function App() {
  const [input, setInput] = React.useState("");
  const [jimi, setJimi] = React.useState([]);
  const messageContainerRef = useRef();

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [jimi]); // jimi 배열이 업데이트될 때마다 스크롤을 아래로 이동

  const handleSend = () => {
    if (input.trim() !== "") {
      setJimi((existingJimi) => [...existingJimi, {text: input, sender: 'user'}])}
      //fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
      fetch(`http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com/api/qa?question=${input}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
      }
      )
      .catch(error => console.log(error))
      setInput("")
    };
  
  const handleKeyDown = (event) => {
    if (event.key == 'Enter'){
      handleSend()
    }
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  React.useEffect(()=> {
    setJimi([])
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
        flexDirection: 'column',
        alignItems: 'center'
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
    <Box sx={{backgroundColor: '#DAD2E9', display: 'flex', justifyContent: 'center'}}>

      <img src={logo} alt="logo" width="30%" height="40px" />
    </Box>
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }} ref={messageContainerRef}>
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
              onKeyDown={handleKeyDown}
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
