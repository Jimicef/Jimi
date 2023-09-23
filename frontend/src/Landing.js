import React from 'react'
import { Box, Button, Card, Avatar, Typography, ThemeProvider } from "@mui/material";
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
import { theme } from './theme';

const Landing = () => {

    const [isEnd, setIsEnd] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        localStorage.setItem("username", locationIp.IPv4)
    }

    const handleVoiceButtonClick = () => {
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
        height: '10vh',
        my: 1,
        fontSize: '2.3vh'
      };

    const titleText = (text) => {
        return (
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>{text}</Typography>
        )
    }

    const subTitleText = (text, isFirst) => {
        return (
            <Typography variant="body1" sx={{fontWeight: 'bold', color: '#555555', mt: isFirst? 4:0}}>{text}</Typography>
        )
    }
  
    React.useEffect(()=>{
        ipDataFetch()
        navigator.mediaDevices.getUserMedia({ audio: true })
    }, [])
    return (
        <div>
            <Box sx={{overflow: 'auto'}}>
                <Box sx={{height: "100vh"}}>
                <BasicCard>
                {/* <Box sx={{display: 'flex', alignItems: 'center', m:3}}>    
                    <Avatar sx={{ bgcolor: "#8977AD" ,mr: 1}}>
                        <ChatIcon sx={{fontSize: "23px"}}/>
                    </Avatar>
                    <Typography variant='h6'>
                    안녕하세요! 👋 저는 지원금 찾기 도우미, 지미입니다.
                    </Typography>
                </Box> */}
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 1, overflow: 'hidden'}}>
                    <img src={process.env.PUBLIC_URL + 'JimiCircle.png'} width = '50px' style={{objectFit: 'cover', borderRadius: '100%'}}/>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
                            {titleText('신청할 수 있는')}
                            {titleText('지원금 제도를')}
                            {titleText('쉽게 찾아드립니다.')}
                            {subTitleText('정부 보조금 24 기반의 모든 지원금 제공', true)}
                            {subTitleText('시각장애인을 위한 음성 지원', false)}
                            {subTitleText('지원금 검색부터 질의응답까지 한번에', false)}
                </Box>
                {/* 정부 24 지원금 14682개
                GPT 3.5 지원
                Whisper 지원 */}

                {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '5vh'}}>
                    <Typography sx={{}}>
                        지원금 검색부터 정보 확인 및 질의응답까지 한번에
                        
                    </Typography>
                    <Typography>
                    음성 지원 기능이 필요하시다면 '음성 기반 챗봇' 버튼을 클릭해주세요.
                    </Typography>
                </Box> */}
                <ThemeProvider theme={theme}>
                    <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', mb:3 }}>
                        <Button variant='contained' color='violet' onClick={handleVoiceButtonClick} sx={buttonStyle}><KeyboardVoiceIcon fontSize='large' sx={{mr: 1}}/>시각 장애인을 위한 음성 기반 챗봇</Button>
                        <Button variant='contained' color= 'darkViolet' onClick={()=>navigate('/nonvoice')} sx={buttonStyle}><FaceIcon fontSize='large' sx={{mr: 1}}/>텍스트 기반 챗봇</Button>
                    </Box>
                </ThemeProvider>
                
            
                </BasicCard>
                </Box>
                {isEnd && <Box sx={{height: "100vh"}}><Voice/></Box>}
            </Box>
        </div>
    )
}

export default Landing