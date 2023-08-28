import { Box, Card, Avatar, Typography, InputLabel, MenuItem, FormControl, Select, TextField, Button } from '@mui/material'
import React, { useState, useRef, useEffect} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";


export const Intro = ({setSupportList, setInput, setRegion, setSubRegion, setServices, input, region, subRegion}) => {
    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = 'http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com'
    }
   // const [region, setRegion] = useState("")
    //const [subRegion, setSubRegion] = useState("")
    const [user, setUser] = useState("")
    const [support, setSupport] = useState({
        "생활안정": false, "주거·자립": false, "보육·교육": false, "고용·창업": false, "보건·의료": false, "행정·안전": false, "임신·출산": false, "보호·돌봄": false, "문화·환경": false, "농림축산어업": false
    })
    //const [input, setInput] = React.useState("");
    const navigate = useNavigate();
    //const [isNav, setIsNav] = useState(false)
    //const [isSelectOpen, setIsSelectOpen] = useState(false);

    // const handleOpenSelect = () => {
    // setIsSelectOpen(true);
    // };

    // const handleCloseSelect = () => {
    // setIsSelectOpen(false);
    // };

    useEffect(()=>{
        window.location.href="/#section"
    },[])

    const handleChangeRegion = (event) => {
        setRegion(event.target.value)
    }

    const handleChangeSubRegion = (event) => {
        setSubRegion(event.target.value)
    }

    const handleChangeUser = (event) => {
        setUser(event.target.value)
    }

    const handleChangeSupport = (event) => {
        setSupport(event.target.value)
    }
    const handleCheckBox = (event) => {
        setSupport({...support, [event.target.name]: event.target.checked})
    }

    const handleSubmit = () => {
        const selectedSupports = Object.keys(support).filter(key => support[key]).join("&");

        // fetch(`${apiEndPoint}/api/userinfo`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         region: region,
        //         subRegion: subRegion,
        //         services: selectedSupports,
        //         user: user,
        //         circumstance: input
        //     })
        // })
        console.log(subRegion, selectedSupports)
        fetch(`${apiEndPoint}/service_list?keyword=${input}&count=0&chktype1=${selectedSupports}&siGunGuArea=${subRegion}&sidocode=${region}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setSupportList(data.support)
            window.location.href = '/#sectionTwo'
            setServices(selectedSupports)
            //setIsNav(!isNav)
        })
        .catch(error => {
            console.error("에러:", error)
        })
    }

    const regionList = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도", "강원특별자치도"]

    const subRegionList = {
        "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
        "부산광역시": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
        "대구광역시": ["군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
        "인천광역시": ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
        "광주광역시": ["광산구", "남구", "동구"," 북구", "서구"],
        "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
        "울산광역시": ["남구", "동구", "북구", "울주군", "중구"],
        "세종특별자치시": ["세종특별자치시"],
        "경기도": ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
        "충청북도": ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군","진천군", "청주시", "충주시"],
        "충청남도": ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
        "전라북도": ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
        "전라남도": ["강진군", "고흥군"," 곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
        "경상북도": ["경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
        "경상남도": ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
        "제주특별자치도": ["서귀포시", "제주시"],
        "강원특별자치도": ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"]
    }
    const supportList = ["생활안정", "주거·자립", "보육·교육", "고용·창업", "보건·의료", "행정·안전", "임신·출산", "보호·돌봄", "문화·환경", "농림축산어업"]
  return (
    <Box sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
        <Card sx={{p:3, width: '60%', height: '80%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>    
                <Avatar sx={{ bgcolor: "#8977AD" ,mr: 1}}>
                B
                </Avatar>
                <Typography variant='h6'>
                    안녕하세요, 지원금 찾기 도우미 - 지미입니다.
                </Typography>
            </Box>
            <Typography variant='body1'>
                (필수) 기본적인 정보를 입력하시면, 그에 맞는 지원금 제도를 제공해드립니다. <br/>
                (선택) 구체적인 상황을 입력하시면, 상황에 맞는 지원금을 AI를 통해 추천해드립니다.
            </Typography>
            <Card sx={{m: 2, p:1, bgcolor: "#DAD2E9"}}>
                <Typography>지역</Typography>
                <Box sx={{display: 'flex', m: 1, mb: 2}}>
                    
                    <Box sx={{ minWidth: 120, mr: 3}}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">시/도</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={region}
                            label="Region"
                            onChange={handleChangeRegion}
                            >
                            {regionList.map((re, idx) => (
                                <MenuItem value={re} key={idx}>{re}</MenuItem>
                            ))}
                            
                            </Select>
                        </FormControl>
                    </Box>
                    {/* <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">시/도</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={region}
                            onChange={handleChangeRegion}
                        >
                            {regionList.map((re, idx) => (
                                <FormControlLabel value={re} control={<Radio size='small'/>} label={re}/>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">시/군/구</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={subRegion}
                            onChange={handleChangeSubRegion}
                        >
                            {subRegionList[region] && subRegionList[region].map((re, idx) => (
                                <FormControlLabel value={re} control={<Radio size='small'/>} label={re}/>
                            ))}
                        </RadioGroup>
                    </FormControl> */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel >시/군/구</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={subRegion}
                            label="Subregion"
                            onChange={handleChangeSubRegion}
                            // onOpen={handleOpenSelect}
                            // onClose={handleCloseSelect}
                            //style={{ pointerEvents: isSelectOpen ? 'auto' : 'none' }}
                            >
                            {subRegionList[region] && subRegionList[region].map((re, idx) => (
                                <MenuItem value={re} key={idx}>{re}</MenuItem>
                            ))}
                            
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <hr/>
                <Box>
                    <Typography>서비스 분야</Typography>
                    <FormControl>
                        <FormGroup 
                        row>
                            {supportList.map((su, idx) => (
                                <FormControlLabel control={<Checkbox checked={support[su]} onChange={handleCheckBox}/>} name={su} label={su} key={idx}/>

                            ))}
                            
                        </FormGroup>
                    </FormControl>
                </Box>
                <hr/>
                <Box>
                    <Typography>사용자 구분</Typography>
                    <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">사용자 구분</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={user}
                            onChange={handleChangeUser}
                        >
                            <FormControlLabel value="개인(가구)" control={<Radio />} label="개인가구"/>
                            <FormControlLabel value="소상공인" control={<Radio />} label="소상공인"/>
                            <FormControlLabel value="법인" control={<Radio />} label="법인"/>
                        </RadioGroup>
                    </FormControl>
                </Box>
                <hr/>
                <Box>
                    <Typography>구체적인 상황입력(선택)</Typography>
                    <TextField
                    size="small"
                    fullWidth
                    multiline
                    placeholder="자신의 상황을 구체적으로 적을 수록 더 정확한 지원금 제도를 추천해드립니다."
                    variant="outlined"
                    value={input}
                    onChange={(event)=>setInput(event.target.value)}
                    />
                </Box>
            </Card>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant='contained' color="secondary" onClick={handleSubmit}>지원금 추천받기</Button>
            </Box>
        </Card>
    </Box>
  )
}

