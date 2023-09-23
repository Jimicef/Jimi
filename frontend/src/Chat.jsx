import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, ThemeProvider, Card} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "./message";
import { useEffect, useRef, useState } from "react";
import { theme } from "./theme";
import logo from './logo.png';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { SET_GO_TO_CHAT } from "./action/action";
import { getSpeech } from "./tts";
import BasicCard from "./layout/BasicCard";


function Chat() {
  const [input, setInput] = React.useState("");
  const [jimi, setJimi] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAnswerEnd, setIsAnswerEnd] = React.useState(false)
  const [links, setLinks] = React.useState([])
  const [partLink, setPartLink] = React.useState("")
  const messageContainerRef = useRef();
  const [minTwenty, setminTwenty] = useState('')
  const [isDot, setIsDot] = useState(false)

  const dispatch = useDispatch()

  const summary = useSelector((state) => state.summary)
  const goToChat = useSelector((state) => state.goToChat)

  var apiEndPoint;
  if (process.env.NODE_ENV == 'development') {
    apiEndPoint = process.env.REACT_APP_SWAGGER_API
  }
  else {
    apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
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
        dispatch({
          type: SET_GO_TO_CHAT,
          data: false
        })
        // setGoToChat(false)
    }
  }, [goToChat])


  const handleSend =async() => {
    if (input.trim() !== "") {
        handleQuestion(input)
        
    }
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
  }, [summary])

  const handleQuestion = async(quest) => {
    setJimi((existingJimi) => [...existingJimi, {text: quest, sender: 'user'}])
    // setJimi((existingJimi) => [...existingJimi, {text: '입력을 받았습니다', sender: 'user', system: true}])
        //fetch(`${process.env.REACT_APP_SWAGGER_API}/api/qa`, {
        setIsLoading(true)
        setInput("")
        setminTwenty('')
        try {
            const modifiedJimi = jimi.filter(item => !item.support).map(item => {
                // 'text'를 'content'로 변경
                const content = item.text;
                
                // 'sender'를 'role'로 변경, 'bot'은 'assistant'로 변경
                const role = item.sender === 'bot' ? 'assistant' : item.sender;
            
                // 수정된 데이터를 포함하는 객체를 반환
                return { content, role}; // 여기서 link도 함께 복사하거나 유지합니다.
            });

            //console.log(modifiedJimi)
            setJimi((existingJimi) => [...existingJimi, {text: '답변을 생성중입니다', sender: 'user', system: true}])
            
            
            const response = await fetch(`${apiEndPoint}/api/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username"),
                    question: quest,
                    history: modifiedJimi.length>10?modifiedJimi.slice(-10):modifiedJimi,
                    summary: summary,
                    voice: 0
                })
            })
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            var flag = false
            
            while (true) {
                const { value, done } = await reader.read()
                if (done) {              
                    break
                }
                //console.log(value)
                const decodedChunk = decoder.decode(value, { stream: true });
                // decodedChunk를 계속 받아서 20글자가 넘어가면, getSpeech로 읽게 한후 해당값은 초기화
                
                
                //checkMinTwenty()
                // if (decodedChunk.includes('.')){
                //   setIsDot(!isDot)
                // }
                // getSpeech(decodedChunk)
                // console.log(decodedChunk)
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
                        if (decodedChunk.includes('ˇ')) {
                            // console.log("it is end of answer")
                            //setIsAnswerEnd(true)
                            const idx = decodedChunk.indexOf('ˇ')
                            const decodedChunkArray = decodedChunk.slice(idx+1).split("˘")
                            setminTwenty(() => previousData + decodedChunk.slice(0, idx))
                            return [...updatedJimi, { text: previousData+decodedChunk.slice(0, idx), link: decodedChunkArray, sender: 'bot' }]
                        }
                        else {
                            return [...updatedJimi, { text: previousData+decodedChunk, link:[], sender: 'bot' }];
                        }
                    } else if (lastItem.sender === 'user') {
                        // 마지막 요소가 'user'인 경우, 그대로 추가
                        return [...existingJimi, { text: decodedChunk, sender: 'bot' }];
                    }

                    return existingJimi; // 예외 상황 처리
                })
            }

            // setJimi((existingJimi) => {
            //     const lastItem = existingJimi[existingJimi.length - 1];
            //     const previousData = lastItem.text
            //     const updatedJimi = existingJimi.slice(0, -1);
            //     return [...updatedJimi, { text: previousData, link: arrayData, sender: 'bot' }];
            // })
            
        } catch(error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            // setIsAnswerEnd(true)
            // getSpeech(minTwenty)
            // setminTwenty('')
        }
        // initMinTwenty()
        window.scrollTo({top: window.innerHeight*2, behavior: 'smooth' })
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

  const handleWay = () => {
    setJimi((existingJimi) => [...existingJimi, {text: "신청방법 전체보기", sender: 'user'}])
    setJimi((existingJimi) => [...existingJimi, {text: summary.way, sender: 'bot'}])
  }

  return (
    
    <BasicCard>
    {/* <Box sx={{backgroundColor: '#DAD2E9', display: 'flex', justifyContent: 'center'}}>

      <img src={logo} alt="logo" width="30%" height="40px" />
    </Box> */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 120 }} ref={messageContainerRef}>
        {jimi.map((message, index) => (
          <Message key={index} message={message} handleQuestion={handleQuestion} handleTarget={handleTarget} handleContent={handleContent}
          handleDocs={handleDocs} handleSelection={handleSelection} handleWay={handleWay}/>
        ))}
      </Box>
      <Box sx={{display:'flex', p: 2, backgroundColor: "background.default", minWidth: 120 }}>
        {/* <Grid container spacing={2}> */}
            <ThemeProvider theme={theme}>
          <Box sx={{width: "90%", mr: 2}}>
            <TextField
              size="small"
              fullWidth
              placeholder="해당 지원금 제도에 대해 무엇이든 질문해주세요"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              color="deepDarkViolet"
            />
          </Box>
          <Box >

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
      
              
          </Box>
            </ThemeProvider>
        {/* </Grid> */}
      </Box>
      </BasicCard>
    
  );
};

export default Chat;