import * as React from "react";
import { SectionsContainer, Section } from "react-fullpage";
import Chat from "./Chat";
import {Intro} from "./Intro";
import {SupportList} from "./SupportList";
import { Box } from "@mui/material";
import './App.css'
import { BrowserRouter, Route, Switc, Routes } from "react-router-dom";
import { FullPage, Slide } from "react-full-page";
import { useDispatch, useSelector } from "react-redux";
import { SET_SUPPORT_LIST, SET_ANSWER } from "./action/action";

const NonVoice = () => {
    const supportList= useSelector((state) => state.supportList)
    const summary = useSelector((state) => state.summary)
    const dispatch = useDispatch()
  
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

    // const ipDataFetch = async() =>{
    //     const ipData = await fetch('https://geolocation-db.com/json/');
    //     const locationIp = await ipData.json();
    //     sessionStorage.setItem("username", locationIp.IPv4)
    // }
  
    // React.useEffect(()=>{
    // //   const ipData = await fetch('https://geolocation-db.com/json/');
    // //   const locationIp = await ipData.json();
    // //   sessionStorage.setItem("username", locationIp.IPv4)
    //     ipDataFetch()
    // }, [])
  
    React.useEffect(()=> {
      if(supportList === null){
        window.scrollTo({top: 0, behavior: 'smooth' })
        alert("검색 결과가 없습니다.")
        dispatch({
          type: SET_SUPPORT_LIST,
          data: ""
      })
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
        <Box sx={{overflow: 'auto'}}>
          <Box sx={{height: "100vh"}}>
            <Intro/>
          </Box>
          {(supportList && supportList.length>0) && <Box sx={{height: "100vh"}}>
            <SupportList />
          </Box>}
          {summary !=="" && <Box sx={{height: "100vh"}}>
            <Chat/>
          </Box>}
        </Box>
  
        
        
     </div> 
    )
}

export default NonVoice