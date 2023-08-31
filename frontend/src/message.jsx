import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, Card, ThemeProvider} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from '@mui/icons-material/Chat';
import FaceIcon from '@mui/icons-material/Face';
import { theme } from "./theme";

export const Message = ({ message, handleQuestion, handleTarget, handleContent, handleDocs, handleSelection }) => {
    const isBot = message.sender === "bot";

    const handleClickUrl = (url) => {
      window.open(url)
    }
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isBot ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            //flexDirection: isBot ? "row" : "row-reverse",
            alignItems: "flex-start",
            width: '100%',
              p: 2,
              ml: isBot ? 0 : 0,
              mr: isBot ? 0 : 0,
              backgroundColor: isBot ? "white" : "#DAD2E9",
              borderRadius: isBot ? "20px 20px 20px 20px" : "20px 20px 20px 20px",
          }}
        >
          {isBot ?
            <Avatar sx={{ bgcolor: "#8977AD", mr: 1, width: "30px", height: "30px" }}>
              <ChatIcon sx={{fontSize: "18px"}}/>
            </Avatar>
            : <Avatar sx={{ bgcolor: "white", color: "#8977AD", mr: 1, width: "30px", height: "30px" }}>
              <FaceIcon />
          </Avatar>
          }
          <Box> 
            {message.text && 
              <Typography variant="body1">{message.text}</Typography>
            }
            {/* {console.log(Boolean(message.support)== false)} */}
            {message.support ? (
              
                <Box>
                  {/* {console.log("here: ",message.support)} */}
                  {message.support.institution && <Typography variant="body2" sx={{ display: "inline-block", borderRadius: 3, bgcolor: "#DAD2E9", px: 1, mb: 1}}>{message.support.institution}</Typography>}
                  {message.support.title && <Typography variant="body1" sx={{fontWeight: 'bold'}}>{message.support.title}</Typography>}
                  {message.support.description && <Typography variant="body1">{message.support.description}<br/><br/></Typography>}
                  {message.support.dueDate && <Typography variant="body2">🗓️신청기간: {message.support.dueDate}<br/><br/></Typography>}
                  {/* {message.support.institution && <Typography variant="body2">🏢소관기관: {message.support.institution}<br/><br/></Typography>} */}
                  {message.support.format && <Typography variant="body2">⚙️지원형태: {message.support.format}<br/><br/></Typography>}
                  
                  {message.support.selection && <Typography variant="body2">✔선정기준: {message.support.selection.length>150?message.support.selection.slice(0, 150)+"⋯":message.support.selection}<br/></Typography>}
                  {message.support.selection.length>150 &&<Typography variant="body2" onClick={handleSelection}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>선정기준 전체보기</Typography>}
                  <br/>
                  {message.support.target && <Typography variant="body2">👤지원대상: {message.support.target.length>150?message.support.target.slice(0, 150)+"⋯":message.support.target}<br/></Typography>}
                  {message.support.target.length>150 && <Typography variant="body2" onClick={handleTarget}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>지원대상 전체보기</Typography>}
                  <br/>
                  {message.support.content && <Typography variant="body2">✍🏻지원내용: {message.support.content.length>150?message.support.content.slice(0, 150)+"⋯":message.support.content}</Typography>}
                  {message.support.content.length>150 && <Typography variant="body2" onClick={handleContent}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>지원내용 전체보기</Typography>}
                  <br/>
                  {/* {message.support[0].way && <Typography variant="body2" sx={{fontWeight: 'bold'}}>📑신청방법<br/></Typography>} */}
                  {/* {message.support[0].dueDate && <Typography variant="body2">🗓️신청기간: {message.support[0].dueDate}<br/></Typography>} */}
                  {message.support.rcvInstitution && <Typography variant="body2">🏠접수센터: {message.support.rcvInstitution}<br/><br/></Typography>}
                  {message.support.way && <Typography variant="body2">✳️신청방법: {message.support.way}<br/><br/></Typography>}
                  {message.support.url && <Typography variant="body2" sx={{ display: 'flex', whiteSpace: 'nowrap'}} ><Box>📎</Box> <Box sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}}} onClick={()=>handleClickUrl(message.support.url)}>{message.support.url}</Box><br/><br/></Typography>}
                  {message.support.docs && <Typography variant="body2">📑제출서류: {message.support.docs.length>150?message.support.docs.slice(0, 150)+"⋯":message.support.docs}</Typography>} 
                  {message.support.docs.length>150 &&<Typography variant="body2" onClick={handleDocs}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>제출서류 전체보기</Typography>}
                  <br/>

                    <Typography variant="body2" onClick={()=>handleQuestion("지원대상이 맞는지 확인하기")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                    지원대상이 맞는지 확인하기
                    </Typography>
                  <Typography variant="body2" onClick={()=>handleQuestion("지원대상 쉽게보기")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                    지원대상 쉽게보기                   </Typography>
                  <Typography variant="body2" onClick={()=>handleQuestion("지원내용 쉽게보기")}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "flex", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>지원내용 쉽게보기</Typography>
                    
                  
                  {/* {message.support[0].docs && <Typography variant="body2">📎제출서류:</Typography>} 
                  {message.support[0].docs && message.support[0].docs.map((doc) => (
                    <Box sx={{display: 'flex'}}><Typography variant="body2">-</Typography><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>{doc}</Typography></Box>
                  ))} */}
                  
                </Box>
              
                
              ):null}
            
          </Box>
        </Paper>
      </Box>
    );
  };