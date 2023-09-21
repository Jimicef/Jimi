import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getSpeech } from '../tts';
import { useDispatch } from 'react-redux';
import { SET_FIRST_JIMI } from '../action/action';

const LandingButton = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
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

    const handleButtonClick = () => {
        getSpeech('')
        if (props.url === '/voice'){
            fetch(`${apiEndPoint}/api/voice/chat`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: SET_FIRST_JIMI,
                    data: data.voiceAnswer
                })
                //getSpeech(data.voiceAnswer)
                navigate(props.url)
                
        })
        } else {
            navigate(props.url)
        }
    }
  
    return (
      <div>
        <Button variant='contained' color='secondary' onClick={handleButtonClick} sx={buttonStyle}>
          {props.children}
        </Button>
      </div>
    );
  }

export default LandingButton