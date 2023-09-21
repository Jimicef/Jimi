import React from 'react'
import { Box, Button, Card, Avatar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import BasicCard from './layout/BasicCard';
import LandingButton from './component/LandingButton';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import FaceIcon from '@mui/icons-material/Face';

const Landing = () => {
    const ipDataFetch = async() =>{
        const ipData = await fetch('https://geolocation-db.com/json/');
        const locationIp = await ipData.json();
        sessionStorage.setItem("username", locationIp.IPv4)
    }
  
    React.useEffect(()=>{
        ipDataFetch()
    }, [])
    return (
        <div>
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
                <LandingButton url="/voice"><KeyboardVoiceIcon fontSize='large' sx={{mr: 1}}/> 음성 지원 지미</LandingButton>
                <LandingButton url="/nonvoice"><FaceIcon fontSize='large' sx={{mr: 1}}/>일반 지미</LandingButton>
            </Box>
            
        
        </BasicCard>
        </div>
    )
}

export default Landing