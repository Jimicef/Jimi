import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, ThemeProvider, Card} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import { useEffect, useRef } from "react";
import { theme } from "./theme";
import logo from './logo.png';
import './App.css';


function Chat({summary}) {
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

  useEffect(()=>{
    
  })

  const handleSend = () => {
    if (input.trim() !== "") {
      setJimi((existingJimi) => [...existingJimi, {text: input, sender: 'user'}])}
      //fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
      fetch(`${apiEndPoint}/chat`,
      {
        method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: input
            })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
        // if (data.answer !== null) {
        //   console.log(data)
        //   setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
        // }
        // if (data.support !== null) {
        //   if (data.support.length === 1) {
        //     setJimi((existingJimi) => [...existingJimi, {support : data.support, sender: 'bot'}])
        //   }
        //   else {
        //     setJimi((existingJimi) => [...existingJimi, {support: data.support, sender: 'bot'}])
        //   }
        // }
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
    setJimi((existingJimi) => [...existingJimi,{support: summary, sender: 'bot'}])
    // fetch(`${apiEndPoint}/api/qa`)
    // .then(response => response.json())
    // .then(data => {
    //   setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])} 
    // )
    // fetch(`${apiEndPoint}/test`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     hi: "hi"
    //   })
    // }).then(response => response.json())
    // .then(data => {
    //   console.log(data)
    // }
    // )
  }, [summary])

  const handleCheckTarget = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "지원대상 확인하기", sender: 'user'}])
  }

  const handleTarget = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "지원대상 원문보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.target, sender: 'bot'}])
    
  }

  const handleContent = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "지원내용 원문보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.content, sender: 'bot'}])
    
  }

  return (
    <Box
      sx = {{
        height: "100vh",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
    
    <Card
      sx={{
        width: '60%',
        height: "80%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
        overflow: "auto"
      }}
    > 
    <Box sx={{backgroundColor: '#DAD2E9', display: 'flex', justifyContent: 'center'}}>

      <img src={logo} alt="logo" width="30%" height="40px" />
    </Box>
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }} ref={messageContainerRef}>
        {jimi.map((message, index) => (
          <Message key={index} message={message} handleCheckTarget={handleCheckTarget} handleTarget={handleTarget} handleContent={handleContent}/>
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
    </Card>
    </Box>
  );
};

export default Chat;