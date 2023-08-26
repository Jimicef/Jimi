import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, ThemeProvider} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import { useEffect, useRef } from "react";
import { theme } from "./theme";
import logo from './logo.png';
import './App.css';


function App() {
  const [input, setInput] = React.useState("");
  const [jimi, setJimi] = React.useState([]);
  const messageContainerRef = useRef();

  var apiEndPoint;
  if (process.env.NODE_ENV == 'development') {
    apiEndPoint = process.env.REACT_APP_SWAGGER_API
  }
  else {
    apiEndPoint = 'http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com'
  }

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
      fetch(`${apiEndPoint}/api/qa?question=${input}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.answer !== null) {
          setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
        }
        else if (data.support !== null) {
          if (data.support.length === 1) {
            setJimi((existingJimi) => [...existingJimi, {support : data.support, sender: 'bot'}])
          }
          else {
            setJimi((existingJimi) => [...existingJimi, {support: data.support, sender: 'bot'}])
          }
        }
        //setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
      }
      )
      .catch(error => console.log(error))
      setInput("")
    };
  
  const handleKeyDown = (event) => {
    if (event.key == 'Enter' && event.nativeEvent.isComposing === false){
      handleSend()
    }
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  React.useEffect(()=> {
    setJimi([])
    fetch(`${apiEndPoint}/api/qa?question="시작"`)
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
        width: '640px',
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
            <ThemeProvider theme={theme}>
              <Button
                fullWidth
                color="violet"
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
              >
                Send
              </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Box>
  );
};

export default App;
