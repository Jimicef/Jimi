import { Box, Card, Avatar, Typography, Button } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react'

const sidoCode = {
    "서울특별시": "tab1100000000",
    "부산광역시": "tab2600000000",
    "대구광역시": "tab2700000000",
    "인천광역시": "tab2800000000",
    "광주광역시": "tab2900000000",
    "대전광역시": "tab3000000000",
    "울산광역시": "tab3100000000",
    "세종특별자치시": "tab3600000000", 
    "경기도": "tab4100000000", 
    "충청북도": "tab4300000000", 
    "충청남도": "tab4400000000", 
    "전라북도": "tab4500000000", 
    "전라남도": "tab4600000000", 
    "경상북도": "tab4700000000", 
    "경상남도": "tab4800000000", 
    "제주특별자치도": "tab5000000000", 
    "강원특별자치도": "tab5100000000"
};

export const SupportList = ({supportList, setSupportList, input, count, setCount, services, region, subRegion, user, setSummary, answer, isLastPage, setIsLastPage, setGoToChat}) => {
    const [isLoadingPage, setIsLoadingPage] = React.useState(false)
    const [isLoadingChat, setIsLoadingChat] = React.useState(false)
    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = 'http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com'
    }
    const handleNextPage = () => {
        setIsLoadingPage(true)
        fetch(`${apiEndPoint}/service_list?keyword=${input}&count=${count+1}&chktype1=${services}&siGunGuArea=${subRegion}&sidocode=${sidoCode[region]}&svccd=${user}`)
        .then(response => response.json())
        .then(data => {
            setSupportList(data.support)
            setCount(count+1)
            setIsLastPage(data.lastpage)
            //window.location.href = '/#sectionTwo'
            //setIsNav(!isNav)
        })
        .catch(error => {
            console.error("에러:", error)
        })
        .finally(()=> {
            setIsLoadingPage(false)
        })
    }
    const handlePrevPage = () => {
        setIsLoadingPage(true)
        fetch(`${apiEndPoint}/service_list?keyword=${input}&count=${count-1}&chktype1=${services}&siGunGuArea=${subRegion}&sidocode=${sidoCode[region]}&svccd=${user}`)
        .then(response => response.json())
        .then(data => {
            setSupportList(data.support)
            setCount(count-1)
            setIsLastPage(data.lastpage)
            //window.location.href = '/#sectionTwo'
            //setIsNav(!isNav)
        })
        .catch(error => {
            console.error("에러:", error)
        })
        .finally(()=> {
            setIsLoadingPage(false)
        })
    }

    const goToChat = (serviceId) => {
        setIsLoadingChat(true)
        fetch(`${apiEndPoint}/chat?serviceId=${serviceId}`)
        .then(response => response.json())
        .then(data => {
            setSummary(data)
            setGoToChat(true)
            //sessionStorage.setItem("summary", JSON.stringify(data))
            //window.scrollTo({top: window.innerHeight*2, behavior: 'smooth' })
            //window.location.href = '/'
            //window.location.href = '/chat'
        })
        .catch(error => {
            console.error("에러:", error)
        })
        .finally(()=> {
            setIsLoadingChat(false)
        })
    }

    // React.useEffect(()=> {
    //     console.log(supportList)
    // },[])
  return (
    <Box sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Card sx={{width: '820px', height: '760px', bgcolor: "grey.200", overflow: 'auto'}}>
            <Box sx={{display: 'flex', alignItems: 'center', m: 3}}>    
                <Avatar sx={{ bgcolor: "#8977AD",mr: 1}}>
                <ChatIcon sx={{fontSize: "23px"}}/>
                </Avatar>
                <Typography variant='h6'>
                    {answer}
                </Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Box sx={{display: 'flex', flexWrap: "wrap", justifyContent: 'center', alignItems: 'center'}}>
                {supportList.map((sup, idx) => (
                    <Card sx={{width: "225px", mx: 1, p: 1, mb: 3, height: "255px"}} key={sup.serviceId}>
                        <Typography variant="body2" sx={{ display: "inline-block", borderRadius: 3, bgcolor: "#DAD2E9", px: 1, mb: 1}}>{sup.institution}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'column', height: "225px"}}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{sup.title.length>25?sup.title.slice(0,25)+"···":sup.title}</Typography>
                        <Typography variant="body2">{sup.description.length>40?sup.description.slice(0,40)+"···":sup.description}</Typography>
                        <br />
                        <Typography variant="body2">🗓️신청기간: {sup.dueDate.length > 12?sup.dueDate.slice(0, 12)+"···":sup.dueDate}</Typography>
                        <Typography variant="body2">⚙️지원형태: {sup.format}</Typography>
                        {sup.rcvInstitution && <Typography variant="body2">🏠접수기관: {sup.rcvInstitution.length>12?sup.rcvInstitution.slice(0,12)+"···":sup.rcvInstitution}</Typography>}
                        <Typography variant="body2">📞전화문의: {sup.phone.length>12?sup.phone.slice(0,12)+"···":sup.phone}</Typography>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 'auto'}}>
                            <Button disabled={isLoadingChat} variant='outlined' color='secondary' size='small' sx={{mt: 1}} onClick={()=>goToChat(sup.serviceId)}>자세히 보기</Button>
                        </Box>
                        </Box>
                        {/* <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>👤지원대상</Typography></Box>
                        <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>✍🏻지원내용</Typography></Box>
                        <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>📑신청방법</Typography></Box> */}
                  </Card>
                ))}
            </Box>
            
            <>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>{count+1}</Box>
            {isLastPage?(count>0?<Box sx={{display: 'flex', justifyContent: 'flex-start', m: 1}}>
                <Button disabled={isLoadingPage} variant="contained" color="secondary" startIcon={<NavigateNextIcon style={{ transform: "rotate(180deg)" }}/>} onClick={handlePrevPage}>
                    이전 페이지
                </Button>
            </Box>:null):(count>0 ?<Box sx={{display: 'flex', justifyContent: 'space-between', m:1}}>
                <Button disabled={isLoadingPage} variant="contained" color="secondary" startIcon={<NavigateNextIcon style={{ transform: "rotate(180deg)" }}/>} onClick={handlePrevPage}>
                    이전 페이지
                </Button>
                <Button disabled={isLoadingPage} variant="contained" color="secondary" endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                    다음 페이지
                </Button>
            </Box>:<Box sx={{display: 'flex', justifyContent: 'flex-end', m:1}}>
                <Button disabled={isLoadingPage} variant="contained" color="secondary" endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                    다음 페이지
                </Button>
            </Box>)}
            {/* {count>0 ?<Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="contained" color="secondary" startIcon={<NavigateNextIcon style={{ transform: "rotate(180deg)" }}/>} onClick={handlePrevPage}>
                    이전 페이지
                </Button>
                <Button variant="contained" color="secondary" endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                    다음 페이지
                </Button>
            </Box>:<Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" color="secondary" endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                    다음 페이지
                </Button>
            </Box>
            } */}
            </>
            </Box>
        </Card>
    </Box>
  )
}
