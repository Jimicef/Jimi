import * as React from "react";
import { SectionsContainer, Section } from "react-fullpage";
import Chat from "./Chat";
import {Intro} from "./Intro";
import {SupportList} from "./SupportList";
import { Box } from "@mui/material";
import './App.css'
import { BrowserRouter } from "react-router-dom";


function App() {
  const [answer, setAnswer] = React.useState("")
  const [supportList, setSupportList] = React.useState([])
  const [input, setInput] = React.useState("")
  const [count, setCount] = React.useState(0)
  const [services, setServices] = React.useState([])
  const [region, setRegion] = React.useState("")
  const [subRegion, setSubRegion] = React.useState("")
  const [user, setUser] = React.useState("")
  const [summary, setSummary] = React.useState("")

  // npm react-full-page로 바꾸기
  // 스크롤의 위치에 따라 액션 다르게

  let optionsIntro = {
    anchors: ['sectionOne'],
    navigation: false,
  };
  let optionsSupport = {
    anchors: ['sectionOne', 'sectionTwo'],
    navigation: false,
  };
  let options = {
    anchors: ['sectionOne', 'sectionTwo', 'sectionThree'],
    activeSection: 'sectionTwo',
    navigation: false,
  };
  const selectedOptions = supportList.length > 0 ? (summary ===""?optionsSupport:options): optionsIntro
  console.log(selectedOptions)
  return (
    <div>
      <BrowserRouter>
      <SectionsContainer {...selectedOptions} scrolling={[true, false, true]}>
      <Section ><Intro setSupportList={setSupportList} setInput={setInput} setCount={setCount} setServices={setServices} setRegion={setRegion} setSubRegion={setSubRegion} supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} user={user} setUser={setUser} setAnswer={setAnswer}/></Section>
      {supportList.length > 0 ? (
          <Section sx={{overflow: 'hidden'}}><SupportList supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} setSupportList={setSupportList} setCount={setCount} user={user} setSummary={setSummary} answer={answer}/></Section>
          
      ): null}
      {summary !=="" ? (
          <Section scrollOverflow={false}><Chat summary={summary}/></Section>
          
      ): null}
      
      </SectionsContainer>
      </BrowserRouter>
   </div> 
  )
};

export default App;
