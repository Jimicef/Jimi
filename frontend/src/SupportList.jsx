import { Box, Card, Avatar, Typography, Button, ThemeProvider } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SET_COUNT, SET_GO_TO_CHAT, SET_IS_LAST_PAGE, SET_SUMMARY, SET_SUPPORT_LIST, SET_VIEW_MORE } from './action/action';
import BasicCard from './layout/BasicCard';
import { theme } from './theme';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationCityIcon from '@mui/icons-material/LocationCity';

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

export const SupportList = () => {
    const [isLoadingPage, setIsLoadingPage] = React.useState(false)
    const [isLoadingChat, setIsLoadingChat] = React.useState(false)
    const answer = useSelector((state) => state.answer)
    const supportList = useSelector((state) => state.supportList)
    const isLastPage = useSelector((state) => state.isLastPage)
    const input = useSelector((state) => state.input)
    const count = useSelector((state) => state.count)
    const services = useSelector((state) => state.services)
    const region = useSelector((state) => state.region)
    const subRegion = useSelector((state) => state.subRegion)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
    }
    const handleNextPage = () => {
        setIsLoadingPage(true)
        fetch(`${apiEndPoint}/api/service_list?keyword=${input}&count=${count+1}&chktype1=${services}&siGunGuArea=${subRegion}&sidocode=${sidoCode[region]}&svccd=${user}&voice=0`)
        .then(response => response.json())
        .then(data => {
            // setSupportList(data.support)
            dispatch({
                type:SET_SUPPORT_LIST,
                data: data.support
            })
            dispatch({
                type: SET_COUNT,
                data: count + 1
            })
            // setCount(count+1)
            // setIsLastPage(data.lastpage)
            dispatch({
                type: SET_IS_LAST_PAGE,
                data: data.lastpage
            })
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
        fetch(`${apiEndPoint}/api/service_list?keyword=${input}&count=${count-1}&chktype1=${services}&siGunGuArea=${subRegion}&sidocode=${sidoCode[region]}&svccd=${user}`)
        .then(response => response.json())
        .then(data => {
            // setSupportList(data.support)
            dispatch({
                type:SET_SUPPORT_LIST,
                data: data.support
            })
            // setCount(count-1)
            dispatch({
                type: SET_COUNT,
                data: count - 1
            })
            dispatch({
                type: SET_IS_LAST_PAGE,
                data: data.lastpage
            })
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
        fetch(`${apiEndPoint}/api/chat?serviceId=${serviceId}&voice=0`)
        .then(response => response.json())
        .then(data => {
            dispatch({
                type: SET_SUMMARY,
                data: data.summary
            })
            dispatch({
                type: SET_GO_TO_CHAT,
                data: true
            })
            // setSummary(data)
            // setGoToChat(true)
            //localStorage.setItem("summary", JSON.stringify(data))
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
    <BasicCard>
            <Box sx={{display: 'flex', alignItems: 'center', m: 3}}>    
                <Avatar sx={{ bgcolor: "#8977AD",mr: 1}}>
                <ChatIcon sx={{fontSize: "23px"}}/>
                </Avatar>
                <Typography variant='h6'>
                    {answer}
                </Typography>
            </Box>
            <ThemeProvider theme={theme}>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Box sx={{display: 'flex', flexWrap: "wrap", justifyContent: 'center', alignItems: 'center'}}>
                    {supportList && supportList.map((sup, idx) => (
                        <Card sx={{width: "225px", mx: 1, p: 1, mb: 3, height: "255px"}} key={sup.serviceId}>
                            <Typography variant="body2" sx={{ display: "inline-block", borderRadius: 3, bgcolor: "#DAD2E9", px: 1, mb: 1}}>{sup.institution}</Typography>
                            <Box sx={{display: 'flex', flexDirection: 'column', height: "225px"}}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{sup.title.length>25?sup.title.slice(0,25)+"⋯":sup.title}</Typography>
                            <Typography variant="body2">{sup.description.length>35?sup.description.slice(0,35)+"⋯":sup.description}</Typography>
                            <br />
                            <Box sx={{display: 'flex', alignItems: 'center'}}><CalendarMonthIcon sx={{fontSize: '15px', color: '#795baf'}}/><Typography variant='body2' sx={{fontWeight: '500', mr:0.5}}>신청기간: </Typography>{sup.dueDate.length > 12?sup.dueDate.slice(0, 12)+"⋯":sup.dueDate}</Box>
                            <Box sx={{display: 'flex', alignItems: 'center'}} ><CardGiftcardIcon sx={{fontSize: '15px', color: '#795baf'}} /><Typography variant='body2' sx={{fontWeight: '500', mr:0.5}}>지원형태: </Typography> {sup.format}</Box>
                            {sup.rcvInstitution && <Box sx={{display: 'flex', alignItems: 'center'}}><LocationCityIcon sx={{fontSize: '15px', color: '#795baf'}}/><Typography variant='body2' sx={{fontWeight: '500', mr:0.5}}>접수기관: </Typography>{sup.rcvInstitution.length>12?sup.rcvInstitution.slice(0,12)+"⋯":sup.rcvInstitution}</Box>}
                            <Box sx={{display: 'flex', alignItems: 'center'}}><LocalPhoneIcon sx={{fontSize: '15px', color: '#795baf'}}/><Typography variant='body2' sx={{fontWeight: '500', mr:0.5}}>접수문의: </Typography> {sup.phone.length>12?sup.phone.slice(0,12)+"⋯":sup.phone}</Box>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 'auto'}}>
                                <Button disabled={isLoadingChat} variant='outlined' color='deepDarkViolet' size='small' sx={{mt: 1}} onClick={()=>{
                                    goToChat(sup.serviceId)
                                    dispatch({
                                        type: SET_VIEW_MORE,
                                        data: false
                                    })
                                    }}>자세히 보기</Button>
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
                    <Button disabled={isLoadingPage} variant="contained" color="deepDarkViolet" startIcon={<NavigateNextIcon style={{ transform: "rotate(180deg)", color: 'white' }}/>} onClick={handlePrevPage} sx={{color: 'white'}}>
                        이전 페이지
                    </Button>
                </Box>:null):(count>0 ?<Box sx={{display: 'flex', justifyContent: 'space-between', m:1}}>
                    <Button disabled={isLoadingPage} variant="contained" color="deepDarkViolet" startIcon={<NavigateNextIcon style={{ transform: "rotate(180deg)", color: 'white' }}/>} onClick={handlePrevPage} sx={{color: 'white'}}>
                        이전 페이지
                    </Button>
                    <Button disabled={isLoadingPage} variant="contained" color="deepDarkViolet" endIcon={<NavigateNextIcon style={{ color: 'white'}} />} onClick={handleNextPage} sx={{color: 'white'}}>
                        다음 페이지
                    </Button>
                </Box>:<Box sx={{display: 'flex', justifyContent: 'flex-end', m:1}}>
                    <Button disabled={isLoadingPage} variant="contained" color="deepDarkViolet" endIcon={<NavigateNextIcon style={{ color: 'white'}} />} onClick={handleNextPage} sx={{color: 'white'}}>
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
            </ThemeProvider>
        </BasicCard>
  )
}
