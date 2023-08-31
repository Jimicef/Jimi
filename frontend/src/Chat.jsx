import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, ThemeProvider, Card} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import { useEffect, useRef } from "react";
import { theme } from "./theme";
import logo from './logo.png';
import './App.css';


function Chat({summary, goToChat, setGoToChat}) {
  const [input, setInput] = React.useState("");
  const [jimi, setJimi] = React.useState([]);
  const [partData, setPartData] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false)
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
    if(goToChat){
        setJimi([])
        setGoToChat(false)
    }
  }, [goToChat])


  const handleSend =async() => {
    if (input.trim() !== "") {
        setJimi((existingJimi) => [...existingJimi, {text: input, sender: 'user'}])
        //fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
        setIsLoading(true)
        setInput("")
        try {
            const response = await fetch(`${apiEndPoint}/chat`,
            {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: sessionStorage.getItem("username"),
                        question: input,
                        history: jimi.length>11?jimi.filter(item => !item.support).slice(-11):jimi.filter(item => !item.support),
                        summary: summary
                    })
            })
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            
            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    break
                }
                //console.log(value)
                const decodedChunk = decoder.decode(value, { stream: true });
                //console.log(decodedChunk)
                // setPartData(prevValue => `${prevValue}${decodedChunk}`)
                // console.log(partData)
                setJimi((existingJimi) => {
                    // 마지막 요소
                    const lastItem = existingJimi[existingJimi.length - 1];
                    //console.log("last:", lastItem)
                    // 마지막 요소의 sender에 따라 다르게 처리
                    if (lastItem.sender === 'bot') {
                        // 마지막 요소가 'bot'인 경우, 마지막 요소를 제외한 배열에 새 요소 추가
                        const previousData = lastItem.text
                        const updatedJimi = existingJimi.slice(0, -1);
                        return [...updatedJimi, { text: previousData+decodedChunk, sender: 'bot' }];
                    } else if (lastItem.sender === 'user') {
                        // 마지막 요소가 'user'인 경우, 그대로 추가
                        return [...existingJimi, { text: decodedChunk, sender: 'bot' }];
                    }

                    return existingJimi; // 예외 상황 처리
                })
            }
        } catch(error) {
            console.log(error)
        } finally {
            setPartData("")
            setIsLoading(false)
        }
    }
        // fetch(`${apiEndPoint}/chat`,
        // {
        //     method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             username: sessionStorage.getItem("username"),
        //             question: input,
        //             history: jimi.length>11?jimi.filter(item => !item.support).slice(-11):jimi.filter(item => !item.support),
        //             summary: summary
        //         })
        // })
        // // .then(response => response.json())
        // // .then(data => {
        // //     setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
        // // }
        // // )
        // .then(response => {
        //     const reader = response.body.getReader()
        //     const decoder = new TextDecoder()
            
        //     while (true) {
        //         const { value, done } = await reader.read()
        //         if (done) {
        //             break
        //         }
        //         const decodedChunk = decoder.decode(value, { stream: true });
        //         setPartData(prevValue => `${prevValue}${decodedChunk}`)
        //         setJimi((existingJimi) => {
        //             // 마지막 요소
        //             const lastItem = existingJimi[existingJimi.length - 1];

        //             // 마지막 요소의 sender에 따라 다르게 처리
        //             if (lastItem.sender === 'bot') {
        //                 // 마지막 요소가 'bot'인 경우, 마지막 요소를 제외한 배열에 새 요소 추가
        //                 const updatedJimi = existingJimi.slice(0, -1);
        //                 return [...updatedJimi, { text: partData, sender: 'bot' }];
        //             } else if (lastItem.sender === 'user') {
        //                 // 마지막 요소가 'user'인 경우, 그대로 추가
        //                 return [...existingJimi, { text: data.answer, sender: 'bot' }];
        //             }

        //             return existingJimi; // 예외 상황 처리
        //         })
        //     }
        // })
        // .catch(error => console.log(error))
        // .finally(()=>{
        //     setPartData("")
        //     setIsLoading(false)
        // })}
        window.scrollTo({top: window.innerHeight*2, behavior: 'smooth' })
        
    
    };
  
  const handleKeyDown = (event) => {
    if (event.key == 'Enter' && event.nativeEvent.isComposing === false && isLoading === false){
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

  const handleQuestion = (quest) => {
    setJimi((existingJimi) => [...existingJimi, {text: quest, sender: 'user'}])
    fetch(`${apiEndPoint}/chat`,
      {
        method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: quest
            })
      })
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        setJimi((existingJimi) => [...existingJimi, {text: data.answer, sender: 'bot'}])
      }
      )
      .catch(error => console.log(error))
    };
  

  const handleTarget = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "지원대상 전체보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.target, sender: 'bot'}])
    
  }

  const handleContent = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "지원내용 전체보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.content, sender: 'bot'}])
    
  }

  const handleDocs = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "제출서류 전체보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.docs, sender: 'bot'}])
  }

  const handleSelection = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "선정기준 전체보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.selection, sender: 'bot'}])
  }
  const handleScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
}

  return (
    
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
    {/* <Box sx={{backgroundColor: '#DAD2E9', display: 'flex', justifyContent: 'center'}}>

      <img src={logo} alt="logo" width="30%" height="40px" />
    </Box> */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 120 }} ref={messageContainerRef}>
        {jimi.map((message, index) => (
          <Message key={index} message={message} handleQuestion={handleQuestion} handleTarget={handleTarget} handleContent={handleContent}
          handleDocs={handleDocs} handleSelection={handleSelection}/>
        ))}
      </Box>
      <Box sx={{display:'flex', p: 2, backgroundColor: "background.default", minWidth: 120 }}>
        {/* <Grid container spacing={2}> */}
          <Box sx={{width: "90%", mr: 2}}>
            <TextField
              size="small"
              fullWidth
              placeholder="메시지를 입력해주세요"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </Box>
          <Box >
            <ThemeProvider theme={theme}>

              {isLoading?<Button
                fullWidth
                color="violet"
                variant="contained"
                endIcon={<SendIcon />}
                disabled
              />:<Button
                fullWidth
                color="violet"
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
              />}
      
              
            </ThemeProvider>
          </Box>
        {/* </Grid> */}
      </Box>
    </Card>
    
    </Box>
    
  );
};

export default Chat;