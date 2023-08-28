import * as React from "react";
import { SectionsContainer, Section } from "react-fullpage";
import Chat from "./Chat";
import {Intro} from "./Intro";
import {SupportList} from "./SupportList";
import { Box } from "@mui/material";
import './App.css'
import { BrowserRouter } from "react-router-dom";


function App() {
  const [supportList, setSupportList] = React.useState([])
  const [input, setInput] = React.useState("")
  const [count, setCount] = React.useState(0)
  const [services, setServices] = React.useState("")
  const [region, setRegion] = React.useState("")
  const [subRegion, setSubRegion] = React.useState("")

  let optionsIntro = {
    anchors: ['sectionOne'],
    navigation: false,
  };
  let options = {
    anchors: ['sectionOne', 'sectionTwo', 'sectionThree'],
    navigation: false,
  };
  const selectedOptions = supportList.length > 0 ? options : optionsIntro
  console.log(selectedOptions)
  return (
    <div>
      <BrowserRouter>
      <SectionsContainer {...selectedOptions} >
      <Section><Intro setSupportList={setSupportList} setInput={setInput} setCount={setCount} setServices={setServices} setRegion={setRegion} setSubRegion={setSubRegion} supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion}/></Section>
      {supportList.length > 0 ? (
          <Section><SupportList supportList={supportList} input={input} count={count} services={services} region={region} subRegion={subRegion} setSupportList={setSupportList} setCount={setCount} /></Section>
          
      ): null}
      {supportList.length > 0 ? (
          <Section><Chat /></Section>
          
      ): null}
      
      </SectionsContainer>
      </BrowserRouter>
   </div> 
  )
};

export default App;
