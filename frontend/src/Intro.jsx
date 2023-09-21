import { Box, Card, Avatar, Typography, InputLabel, MenuItem, FormControl, Select, TextField, Button } from '@mui/material'
import React, { useState, useRef, useEffect} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { SET_SUPPORT_LIST, SET_ANSWER, SET_IS_LAST_PAGE, SET_INPUT, SET_COUNT, SET_SERVICES, SET_REGION, SET_SUBREGION, SET_USER } from './action/action';
import BasicCard from './layout/BasicCard';


export const Intro = () => {
    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
    }
   // const [region, setRegion] = useState("")
    //const [subRegion, setSubRegion] = useState("")
    //const [user, setUser] = useState("")
    const [support, setSupport] = useState({
        "전체": false, "생활안정": false, "주거·자립": false, "보육·교육": false, "고용·창업": false, "보건·의료": false, "행정·안전": false, "임신·출산": false, "보호·돌봄": false, "문화·환경": false, "농림축산어업": false
    })
    const [isLoading, setIsLoading] = useState(false)
    //const [input, setInput] = React.useState("");
    // const navigate = useNavigate();
    const dispatch = useDispatch()

    const input = useSelector((state) => state.input)
    const region = useSelector((state) => state.region)
    const subRegion = useSelector((state) => state.subRegion)
    const user = useSelector((state) => state.user)
    //const [isNav, setIsNav] = useState(false)
    //const [isSelectOpen, setIsSelectOpen] = useState(false);

    // const handleOpenSelect = () => {
    // setIsSelectOpen(true);
    // };

    // const handleCloseSelect = () => {
    // setIsSelectOpen(false);
    // };

    const handleChangeRegion = (event) => {
        dispatch({
            type: SET_REGION,
            data: event.target.value
        })
        // setRegion(event.target.value)
    }

    const handleChangeSubRegion = (event) => {
        dispatch({
            type: SET_SUBREGION,
            data: event.target.value
        })
        // setSubRegion(event.target.value)
    }

    const handleChangeUser = (event) => {
        dispatch({
            type: SET_USER,
            data: event.target.value
        })
        // setUser(event.target.value)
    }

    // const handleChangeSupport = (event) => {
    //     setSupport(event.target.value)
    // }
    const handleCheckBox = (event) => {
        setSupport({...support, [event.target.name]: event.target.checked})
    }

    const handleWholeCheckBox = (event) => {
        const updatedSupport = {};
  
        // "전체" 체크박스가 체크되어 있으면 모든 값을 true로 설정
        if (event.target.checked) {
            for (const key in support) {
            updatedSupport[key] = true;
            }
        } else {
            // 체크해제되어 있으면 모든 값을 false로 설정
            for (const key in support) {
            updatedSupport[key] = false;
            }
        setSupport(updatedSupport)
        }
        setSupport(updatedSupport);
    }

    const handleEnter = (event) => {
        if (event.key == 'Enter' && event.nativeEvent.isComposing === false && isLoading === false) {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        const selectedSupports = Object.keys(support).filter(key => key!=="전체" && support[key]).map(key => chktype1Code[key]).join("|");
        setIsLoading(true)
        fetch(`${apiEndPoint}/api/service_list?keyword=${input}&count=0&chktype1=${selectedSupports}&siGunGuArea=${subRegion}&sidocode=${sidoCode[region]?sidoCode[region]:""}&svccd=${user}&voice=0`)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            dispatch({
                type: SET_COUNT,
                data: 0
            })
            // setCount(0)
            dispatch({
                type: SET_SUPPORT_LIST,
                data: data.support
            })
            // setSupportList(data.support)
            dispatch({
                type: SET_ANSWER,
                data: data.answer
            })
            // setAnswer(data.answer)
            dispatch({
                type: SET_IS_LAST_PAGE,
                data: data.lastpage
            })
            // setIsLastPage(data.lastpage)

            return Promise.resolve();
            //setIsNav(!isNav)
        })
        .then(() => {
            dispatch({
                type: SET_SERVICES,
                data: selectedSupports
            })
            // setServices(selectedSupports)
        })
        .catch(error => {
            console.error("에러:", error)
        })
        .finally(()=> {
            setIsLoading(false)
        })
    }

    const regionList = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도", "강원특별자치도"]

    const subRegionList = {
        "서울특별시": [{"전체": "1100000000"},{"강남구": "1168000000"},{"강동구": "1174000000"},{"강북구": "1130500000"},{"강서구": "1150000000"},{"관악구": "1162000000"},{"광진구": "1121500000"},{"구로구": "1153000000"},{"금천구": "1154500000"},{"노원구": "1135000000"},{"도봉구": "1132000000"},{"동대문구": "1123000000"},{"동작구": "1159000000"},{"마포구": "1144000000"},{"서대문구": "1141000000"},{"서초구": "1165000000"},{"성동구": "1120000000"},{"성북구": "1129000000"},{"송파구": "1171000000"},{"양천구": "1147000000"},{"영등포구": "1156000000"},{"용산구": "1117000000"},{"은평구": "1138000000"},{"종로구": "1111000000"},{"중구": "1114000000"},{"중랑구": "1126000000"}],
        "부산광역시": [{"전체": "2600000000"},{"강서구": "2644000000"},{"금정구": "2641000000"},{"기장군": "2671000000"},{"남구": "2629000000"},{"동구": "2617000000"},{"동래구": "2626000000"},{"부산진구": "2623000000"},{"북구": "2632000000"},{"사상구": "2653000000"},{"사하구": "2638000000"},{"서구": "2614000000"},{"수영구": "2650000000"},{"연제구": "2647000000"},{"영도구": "2620000000"},{"중구": "2611000000"},{"해운대구": "2635000000"}],
        "대구광역시": [{"전체": "2700000000"},{"군위군": "2772000000"},{"남구": "2720000000"},{"달서구": "2729000000"},{"달성군": "2771000000"},{"동구": "2714000000"},{"북구": "2723000000"},{"서구": "2717000000"},{"수성구": "2726000000"},{"중구": "2711000000"}],
        "인천광역시": [{"전체": "2800000000"},{"강화군": "2871000000"},{"계양구": "2824500000"},{"남동구": "2820000000"},{"동구": "2814000000"},{"미추홀구": "2817700000"},{"부평구": "2823700000"},{"서구": "2826000000"},{"연수구": "2818500000"},{"옹진군": "2872000000"},{"중구": "2811000000"}],
        "광주광역시": [{"전체": "2900000000"},{"광산구": "2920000000"},{"남구": "2915500000"},{"동구": "2911000000"},{"북구": "2917000000"},{"서구": "2914000000"}],
        "대전광역시": [{"전체": "3000000000"},{"대덕구": "3023000000"},{"동구": "3011000000"},{"서구": "3017000000"},{"유성구": "3020000000"},{"중구": "3014000000"}],
        "울산광역시": [{"전체": "3100000000"},{"남구": "3114000000"},{"동구": "3117000000"},{"북구": "3120000000"},{"울주군": "3171000000"},{"중구": "3111000000"}],
        "세종특별자치시": [{"세종특별자치시": "3611000000"}],
        "경기도": [{"전체": "4100000000"},{"가평군": "4182000000"}, {"고양시": "4128000000"}, {"과천시": "4129000000"}, {"광명시": "4121000000"}, {"광주시": "4161000000"}, {"구리시": "4131000000"}, {"군포시": "4141000000"}, {"김포시": "4157000000"}, {"남양주시": "4136000000"}, {"동두천시": "4125000000"}, {"부천시": "4119000000"}, {"성남시": "4113000000"}, {"수원시": "4111000000"}, {"시흥시": "4139000000"}, {"안산시": "4127000000"}, {"안성시": "4155000000"}, {"안양시": "4117000000"}, {"양주시": "4163000000"}, {"양평군": "4183000000"}, {"여주시": "4167000000"}, {"연천군": "4180000000"}, {"오산시": "4137000000"}, {"용인시": "4146000000"}, {"의왕시": "4143000000"}, {"의정부시": "4115000000"}, {"이천시": "4150000000"}, {"파주시": "4148000000"}, {"평택시": "4122000000"}, {"포천시": "4165000000"}, {"하남시": "4145000000"}, {"화성시": "4159000000"}],
        "충청북도": [{"전체": "4300000000"},{"괴산군": "4376000000"}, {"단양군": "4380000000"}, {"보은군": "4372000000"}, {"영동군": "4374000000"}, {"옥천군": "4373000000"}, {"음성군": "4377000000"}, {"제천시": "4315000000"}, {"증평군": "4374500000"}, {"진천군": "4375000000"}, {"청주시": "4311000000"}, {"충주시": "4313000000"}],
        "충청남도": [{"전체": "4400000000"},{"계룡시": "4425000000"}, {"공주시": "4415000000"}, {"금산군": "4471000000"}, {"논산시": "4423000000"}, {"당진시": "4427000000"}, {"보령시": "4418000000"}, {"부여군": "4476000000"}, {"서산시": "4421000000"}, {"서천군": "4477000000"}, {"아산시": "4420000000"}, {"예산군": "4481000000"}, {"천안시": "4413000000"}, {"청양군": "4479000000"}, {"태안군": "4482500000"}, {"홍성군": "4480000000"}],
        "전라북도": [{"전체": "4500000000"},{"고창군": "4579000000"}, {"군산시": "4513000000"}, {"김제시": "4521000000"}, {"남원시": "4519000000"}, {"무주군": "4573000000"}, {"부안군": "4580000000"}, {"순창군": "4577000000"}, {"완주군": "4571000000"}, {"익산시": "4514000000"}, {"임실군": "4575000000"}, {"장수군": "4574000000"}, {"전주시": "4511000000"}, {"정읍시": "4518000000"}, {"진안군": "4572000000"}],
        "전라남도": [{"전체": "4600000000"},{"강진군": "4681000000"}, {"고흥군": "4677000000"}, {"곡성군": "4672000000"}, {"광양시": "4623000000"}, {"구례군": "4673000000"}, {"나주시": "4617000000"}, {"담양군": "4671000000"}, {"목포시": "4611000000"}, {"무안군": "4684000000"}, {"보성군": "4678000000"}, {"순천시": "4615000000"}, {"신안군": "4691000000"}, {"여수시": "4613000000"}, {"영광군": "4687000000"}, {"영암군": "4683000000"}, {"완도군": "4689000000"}, {"장성군": "4688000000"}, {"장흥군": "4680000000"}, {"진도군": "4690000000"}, {"함평군": "4686000000"}, {"해남군": "4682000000"}, {"화순군": "4679000000"}],
        "경상북도": [{"전체": "4700000000"},{"경산시": "4729000000"}, {"경주시": "4713000000"}, {"고령군": "4783000000"}, {"구미시": "4719000000"}, {"김천시": "4715000000"}, {"문경시": "4728000000"}, {"봉화군": "4792000000"}, {"상주시": "4725000000"}, {"성주군": "4784000000"}, {"안동시": "4717000000"}, {"영덕군": "4777000000"}, {"영양군": "4776000000"}, {"영주시": "4721000000"}, {"영천시": "4723000000"}, {"예천군": "4790000000"}, {"울릉군": "4794000000"}, {"울진군": "4793000000"}, {"의성군": "4773000000"}, {"청도군": "4782000000"}, {"청송군": "4775000000"}, {"칠곡군": "4785000000"}, {"포항시": "4711000000"}],
        "경상남도": [{"전체": "4800000000"},{"거제시": "4831000000"}, {"거창군": "4888000000"}, {"고성군": "4882000000"}, {"김해시": "4825000000"}, {"남해군": "4884000000"}, {"밀양시": "4827000000"}, {"사천시": "4824000000"}, {"산청군": "4886000000"}, {"양산시": "4833000000"}, {"의령군": "4872000000"}, {"진주시": "4817000000"}, {"창녕군": "4874000000"}, {"창원시": "4812000000"}, {"통영시": "4822000000"}, {"하동군": "4885000000"}, {"함안군": "4873000000"}, {"함양군": "4887000000"}, {"합천군": "4889000000"}],
        "제주특별자치도": [{"전체": "5000000000"},{"서귀포시": "5013000000"}, {"제주시": "5011000000"}],
        "강원특별자치도": [{"전체": "5100000000"},{"강릉시": "5115000000"}, {"고성군": "5182000000"}, {"동해시": "5117000000"}, {"삼척시": "5123000000"}, {"속초시": "5121000000"}, {"양구군": "5180000000"}, {"양양군": "5183000000"}, {"영월군": "5175000000"}, {"원주시": "5113000000"}, {"인제군": "5181000000"}, {"정선군": "5177000000"}, {"철원군": "5178000000"}, {"춘천시": "5111000000"}, {"태백시": "5119000000"}, {"평창군": "5176000000"}, {"홍천군": "5172000000"}, {"화천군": "5179000000"}, {"횡성군": "5173000000"}]
    }

    // const subRegionList = {
    //     "서울특별시": [{"강남구": "1283"}, {"강남구": "1283"},{"강남구": "1283"},{"강남구": "1283"}]
    // }

    const supportList = ["생활안정", "주거·자립", "보육·교육", "고용·창업", "보건·의료", "행정·안전", "임신·출산", "보호·돌봄", "문화·환경", "농림축산어업"]

    const chktype1Code = {
        "생활안정": "NB0301",
        "주거·자립": "NB0302", "보육·교육": "NB0303", "고용·창업": "NB0304", "보건·의료": "NB0305", "행정·안전": "NB0306", "임신·출산": "NB0307", "보호·돌봄": "NB0308", "문화·환경": "NB0309", "농림축산어업": "NB0310"
    }

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
    

    const userCode = {
       "개인(가구)": "indiv",
       "소상공인": "business",
       "법인": "owner"
    }

  return (
    <BasicCard>
            <Box sx={{display: 'flex', alignItems: 'center', m:3}}>    
                <Avatar sx={{ bgcolor: "#8977AD" ,mr: 1}}>
                    <ChatIcon sx={{fontSize: "23px"}}/>
                </Avatar>
                <Typography variant='h6'>
                안녕하세요! 👋 저는 지원금 찾기 도우미, 지미입니다.
                </Typography>
            </Box>
            <Box sx={{}}>
            <Typography variant='body1' sx={{m: 4}}>
                사용자님이 신청할 수 있는 지원금 제도를 쉽게 찾아드려요! <br/><br/>
                먼저, 지원금을 빠르고 간편하게 찾아보세요!<br/>
                지역, 서비스 분야, 사용자 구분, 검색어를 선택적으로 입력하시면 관련된 지원금 제도를 찾아드릴게요.
            </Typography>
            <Box>
            <Box sx={{height: ["40%", "50%", "60%"], display: 'flex', alignItems:'center', m: 2}}>
            <Box sx={{m: 2, p:3, bgcolor: "white", borderRadius: '30px', boxShadow: '5px 5px 10px grey'}}>
                <Typography sx={{fontWeight: 'bold'}}>지역</Typography>
                <Box sx={{display: 'flex', m: 1, mb: 2}}>
                    
                    <Box sx={{ width:'120px', mr: 3}}>
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
                    <Box sx={{ width: '120px'}}>
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
                            {/* {subRegionList[region] && <MenuItem value={subRegionList[region].slice(3)}>
                                <span style={{ visibility: 'visible'}}>전체</span>
                                </MenuItem>} */}
                            {subRegionList[region] && subRegionList[region].map((re, idx) => {
                                const regionName = Object.keys(re)[0]
                                return <MenuItem value={re[regionName]} key={idx}>{regionName}</MenuItem>
})}
                            
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <hr/>
                <Box>
                    <Typography sx={{fontWeight: 'bold'}}>서비스 분야 (복수선택 가능)</Typography>
                    <FormControl>
                        <FormGroup 
                        row>
                            <FormControlLabel control={<Checkbox checked={support["전체"]} onChange={handleWholeCheckBox}/>} name="전체" label="전체"/>
                            {supportList.map((su, idx) => (
                                <FormControlLabel control={<Checkbox checked={support[su]} onChange={handleCheckBox}/>} name={su} label={su} key={idx}/>

                            ))}
                            
                        </FormGroup>
                    </FormControl>
                </Box>
                <hr/>
                <Box>
                    <Typography sx={{fontWeight: 'bold'}}>사용자 구분</Typography>
                    <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">사용자 구분</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={user}
                            onChange={handleChangeUser}
                        >
                            <FormControlLabel value={userCode["개인(가구)"]} control={<Radio />} label="개인(가구)"/>
                            <FormControlLabel value={userCode["소상공인"]} control={<Radio />} label="소상공인"/>
                            <FormControlLabel value={userCode["법인"]} control={<Radio />} label="법인"/>
                        </RadioGroup>
                    </FormControl>
                </Box>
                <hr/>
                <Box>
                    <Typography sx={{mb: 1, fontWeight: 'bold'}}>검색어</Typography>
                    <TextField
                    size="small"
                    fullWidth
                    placeholder="원하는 검색어를 입력해주세요"
                    variant="outlined"
                    value={input}
                    onChange={(event)=>dispatch({
                        type: SET_INPUT,
                        data: event.target.value
                    })
                        // setInput(event.target.value)
                    }
                    onKeyDown={handleEnter}
                    />
                </Box>
            </Box>
            </Box>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', m:2}}>
                {isLoading?<Button disabled variant='contained' color="secondary">지원금 추천받기</Button>:<Button variant='contained' color="secondary" onClick={handleSubmit}>지원금 추천받기</Button>}
            </Box>
            </Box>
    </BasicCard>
  )
}

