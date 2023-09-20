import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const LandingButton = (props) => {
    const navigate = useNavigate();
  
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
  
    return (
      <div>
        <Button variant='contained' color='secondary' onClick={() => navigate(props.url)} sx={buttonStyle}>
          {props.children}
        </Button>
      </div>
    );
  }

export default LandingButton