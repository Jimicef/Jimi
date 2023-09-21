import React from 'react'
import { Box, Button, Card, Avatar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import BasicCard from './layout/BasicCard';
import LandingButton from './component/LandingButton';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import FaceIcon from '@mui/icons-material/Face';
import Voice from './Voice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SET_FIRST_JIMI, SET_JIMI } from './action/action';
import { getSpeech } from './tts';

const Landing = () => {

    const [isEnd, setIsEnd] = useState(false)
    const dispatch = useDispatch()

    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
    }

    const ipDataFetch = async() =>{
        const ipData = await fetch('https://geolocation-db.com/json/');
        const locationIp = await ipData.json();
        sessionStorage.setItem("username", locationIp.IPv4)
    }

    const handleButtonClick = () => {
        setIsEnd(true)
        getSpeech('')
        fetch(`${apiEndPoint}/api/voice/chat`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: SET_JIMI,
                    data: [{text: data.voiceAnswer, sender: 'bot'}]
                })
                getSpeech(data.voiceAnswer)
                //navigate(props.url)
                window.scrollTo({top: window.innerHeight, behavior: 'smooth' })
            })
    }

    const buttonStyle = {
        margin: '0 auto', // 가로 방향으로 중앙 정렬
        width: '90%',
        display: 'flex', // 내부 요소를 수평 중앙으로 정렬하기 위해 flex 사용
        justifyContent: 'center', // 수평 중앙 정렬
        alignItems: 'center', // 수직 중앙 정렬
        height: '20vh',
        my: 2,
        fontSize: '3vh'
      };
  
    React.useEffect(()=>{
        ipDataFetch()
    }, [])
    return (
        <div>
            <Box sx={{overflow: 'auto'}}>
                <Box sx={{height: "100vh"}}>
                <BasicCard>
                <Box sx={{display: 'flex', alignItems: 'center', m:3}}>    
                    <Avatar sx={{ bgcolor: "#8977AD" ,mr: 1}}>
                        <ChatIcon sx={{fontSize: "23px"}}/>
                    </Avatar>
                    <Typography variant='h6'>
                    안녕하세요! 👋 저는 지원금 찾기 도우미, 지미입니다.
                    </Typography>
                </Box>
                <Typography variant='body1' sx={{m: 4, my: 2}}>
                    사용자님이 신청할 수 있는 지원금 제도를 쉽게 찾아드려요! <br/>
                    먼저, 음성 지원 기능이 필요하시 다면 '음성 지원 기능' 버튼을 클릭해주세요.<br/>
                    
                </Typography>
                

                <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', mb:3 }}>
                    
                    <Button variant='contained' color='secondary' onClick={handleButtonClick} sx={buttonStyle}><KeyboardVoiceIcon fontSize='large' sx={{mr: 1}}/>음성 지원 지미</Button>
                    <LandingButton url="/nonvoice"><FaceIcon fontSize='large' sx={{mr: 1}}/> 일반 지미</LandingButton>
                </Box>
                
            
                </BasicCard>
                </Box>
                {isEnd && <Box sx={{height: "100vh"}}><Voice/></Box>}
            </Box>
        </div>
    )
}

export default Landing