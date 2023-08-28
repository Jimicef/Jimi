import { Box, Card, Avatar, Typography, Button } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react'

export const SupportList = ({supportList, setSupportList, input, count, setCount, services, region, subRegion}) => {
    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = 'http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com'
    }
    const handleNextPage = () => {
        
        fetch(`${apiEndPoint}/service_list?keyword=${input}&count=${count+1}&chktype1=${services}&siGunGuArea=${subRegion}&sidocode=${region}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setSupportList(data.support)
            setCount(count+1)
            //window.location.href = '/#sectionTwo'
            //setIsNav(!isNav)
        })
        .catch(error => {
            console.error("에러:", error)
        })
    }
  return (
    <Box sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Card sx={{p:3, width: '60%', height: '80%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>    
                <Avatar sx={{ bgcolor: "#8977AD" ,mr: 1}}>
                B
                </Avatar>
                <Typography variant='h6'>
                    사용자님에게 맞는 지원금 제도를 추천해드리겠습니다.
                </Typography>
            </Box>
            <Box sx={{display: 'flex', flexWrap: "wrap"}}>
                {supportList.map((sup, idx) => (
                    <Card sx={{width: "26%", mr: 3, p: 1, mb: 3}} key={sup.serviceId}>
                        <Typography variant="body2" sx={{ display: "inline-block", borderRadius: 3, bgcolor: "#DAD2E9", px: 1, mb: 1}}>{sup.region}</Typography>
                        <Typography variant="body1" sx={{fontWeight: 'bold'}}>{sup.title}</Typography>
                        <Typography variant="body1">{sup.description}</Typography>
                        <br />
                        <Typography variant="body2">🗓️신청기간: {sup.dueDate.length > 12?sup.dueDate.slice(0, 12):sup.dueDate}</Typography>
                        <Typography variant="body2">⚙️지원형태: {sup.format}</Typography>
                        <Typography variant="body2">🏠접수기관: {sup.institution}</Typography>
                        <Typography variant="body2">📞전화문의: {sup.phone}</Typography>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant='outlined' color='secondary' size='small' sx={{mt: 1}}>자세히 보기</Button>
                        </Box>
                        {/* <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>👤지원대상</Typography></Box>
                        <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>✍🏻지원내용</Typography></Box>
                        <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>📑신청방법</Typography></Box> */}
                  </Card>
                ))}
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" color="secondary" endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                    다음 페이지
                </Button>
            </Box>
        </Card>
    </Box>
  )
}
