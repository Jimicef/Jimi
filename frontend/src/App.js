import * as React from "react";
import { SectionsContainer, Section } from "react-fullpage";
import Chat from "./Chat";
import {Intro} from "./Intro";
import {SupportList} from "./SupportList";
import { Box } from "@mui/material";
import './App.css'
import { BrowserRouter, Route, Switc, Routes } from "react-router-dom";
import { FullPage, Slide } from "react-full-page";


function App() {
  const [answer, setAnswer] = React.useState("")
  const [supportList, setSupportList] = React.useState([])
  const [isLastPage, setIsLastPage] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [count, setCount] = React.useState(0)
  const [services, setServices] = React.useState([])
  const [region, setRegion] = React.useState("")
  const [subRegion, setSubRegion] = React.useState("")
  const [user, setUser] = React.useState("")
  const [summary, setSummary] = React.useState("")
  const [goToChat, setGoToChat] = React.useState(false)

  // npm react-full-page로 바꾸기
  // 스크롤의 위치에 따라 액션 다르게

  let optionsIntro = {
    anchors: ['sectionOne'],
    //scrollBar: true,
    navigation: false,
  };
  let optionsSupport = {
    anchors: ['sectionOne', 'sectionTwo'],
    //scrollBar: true,
    navigation: false,
  };
  let options = {
    //이렇게 될시 /#section
    //anchors: ['sectionOne', 'sectionTwo', 'sectionThree'],
    //activeSection: 'sectionTwo',
    scrollBar: true,
    navigation: false,
  };
  const selectedOptions = supportList ? (summary ===""?optionsSupport:options): optionsIntro
  //const selectedOptions = supportList.length > 0 ? optionsSupport: optionsIntro
  //console.log(selectedOptions)

  React.useEffect(async()=>{
    const ipData = await fetch('https://geolocation-db.com/json/');
    const locationIp = await ipData.json();
    sessionStorage.setItem("username", locationIp.IPv4)
  }, [])

  React.useEffect(()=> {
    if(supportList === null){
      window.scrollTo({top: 0, behavior: 'smooth' })
      alert("검색 결과가 없습니다.")
      setSupportList([])
    }
    else if (supportList.length > 0){
      window.scrollTo({top: window.innerHeight, behavior: 'smooth' })
      //window.location.href = '/#sectionTwo'
      //window.location.href = '/supportlist'
    } else if(supportList === {}){
      alert("검색 결과가 없습니다.")
    } 
  }, [supportList])

  React.useEffect(()=> {
    if (summary !==""){
      window.scrollTo({top: window.innerHeight*2, behavior: 'smooth' })
      //window.location.href = '/#sectionTwo'
      //window.location.href = '/supportlist'
  } 
  }, [summary])

  return (
    <div>
      <BrowserRouter>
      {/* <Routes>
        <Route path="/" element={<Intro setSupportList={setSupportList} setInput={setInput} setCount={setCount} setServices={setServices} setRegion={setRegion} setSubRegion={setSubRegion} supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} user={user} setUser={setUser} setAnswer={setAnswer} setIsLastPage={setIsLastPage}/>} />
        <Route path="/chat" element={<Chat summary={summary}/>} />
        <Route path="/supportlist" element={<SupportList supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} setSupportList={setSupportList} setCount={setCount} user={user} setSummary={setSummary} answer={answer} setIsLastPage={setIsLastPage} isLastPage={isLastPage}/>} />
      </Routes> */}
      {/* <FullPage controls>
        <Slide>
          <h1>Inner slide content</h1>
        </Slide>
        <Slide>
          <h1>Another slide content</h1>
        </Slide>
      </FullPage> */}
      <Box sx={{overflow: 'auto'}}>
        <Box sx={{height: "100vh"}}>
          <Intro setSupportList={setSupportList} setInput={setInput} setCount={setCount} setServices={setServices} setRegion={setRegion} setSubRegion={setSubRegion} supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} user={user} setUser={setUser} setAnswer={setAnswer} setIsLastPage={setIsLastPage}/>
        </Box>
        {(supportList && supportList.length>0) && <Box sx={{height: "100vh"}}>
          <SupportList supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} setSupportList={setSupportList} setCount={setCount} user={user} setSummary={setSummary} answer={answer} setIsLastPage={setIsLastPage} isLastPage={isLastPage} setGoToChat={setGoToChat}/>
        </Box>}
        {summary !=="" && <Box sx={{height: "100vh"}}>
          <Chat summary={summary} goToChat={goToChat} setGoToChat={setGoToChat}/>
        </Box>}
      </Box>

      {/* <SectionsContainer {...options} >
      {
      // selectedOptions !==options&&
      <Section ><Intro setSupportList={setSupportList} setInput={setInput} setCount={setCount} setServices={setServices} setRegion={setRegion} setSubRegion={setSubRegion} supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} user={user} setUser={setUser} setAnswer={setAnswer} setIsLastPage={setIsLastPage}/></Section>}
      {supportList.length > 0 
      // && selectedOptions !==options
      ? (
          <Section><SupportList supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} setSupportList={setSupportList} setCount={setCount} user={user} setSummary={setSummary} answer={answer} setIsLastPage={setIsLastPage} isLastPage={isLastPage}/></Section>
          
       ): null} 
      {summary !=="" ? (
          <Section><Chat summary={summary}/></Section>
          
       ): null}
      
      </SectionsContainer> */}
      </BrowserRouter>
   </div> 
  )
};

export default App;
