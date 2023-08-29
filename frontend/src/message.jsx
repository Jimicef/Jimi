import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, Card} from "@mui/material";

export const Message = ({ message, handleCheckTarget, handleTarget, handleContent }) => {
    const isBot = message.sender === "bot";

    
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isBot ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isBot ? "row" : "row-reverse",
            alignItems: "flex-end",
          }}
        >
          {isBot && 
            <Avatar sx={{ bgcolor: "#8977AD" }}>
              B
            </Avatar>
          }
          <Paper
            variant="outlined"
            sx={{
              width: '80%',
              p: 2,
              ml: isBot ? 1 : 0,
              mr: isBot ? 0 : 1,
              backgroundColor: isBot ? "white" : "#BDA4D5",
              borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
            }}
          > 
            {message.text && 
              <Typography variant="body1">{message.text}</Typography>
            }
            {/* {console.log(Boolean(message.support)== false)} */}
            {message.support ? (
              
                <Box>
                  {/* {console.log("here: ",message.support)} */}
                  {message.support.title && <Typography variant="body1" sx={{fontWeight: 'bold'}}>{message.support.title}</Typography>}
                  {message.support.description && <Typography variant="body1">{message.support.description}<br/><br/></Typography>}
                  {message.support.dueDate && <Typography variant="body2">🗓️신청기간: {message.support.dueDate}<br/><br/></Typography>}
                  {message.support.format && <Typography variant="body2">⚙️지원형태: {message.support.format}<br/><br/></Typography>}
                  {/* {message.support[0].target && <Typography variant="body2">👤지원대상: {message.support[0].target}<br/><br/></Typography>}
                  {message.support[0].content && <Typography variant="body2">✍🏻지원내용: {message.support[0].content}<br/><br/></Typography>} */}
                  {/* {message.support[0].way && <Typography variant="body2" sx={{fontWeight: 'bold'}}>📑신청방법<br/></Typography>} */}
                  {/* {message.support[0].dueDate && <Typography variant="body2">🗓️신청기간: {message.support[0].dueDate}<br/></Typography>} */}
                  {message.support.way && <Typography variant="body2">✳️신청방법: {message.support.way}<br/><br/></Typography>}
                  {message.support.rcvInstitution && <Typography variant="body2">🏠접수센터: {message.support.rcvInstitution}<br/></Typography>}
                  <Typography variant="body2" onClick={handleCheckTarget}>지원대상이 맞는지 확인하기</Typography>
                  <Typography variant="body2" onClick={handleTarget}>지원대상 원문보기</Typography>
                  <Typography variant="body2" onClick={handleContent}>지원내용 원문보기</Typography>
                  {/* {message.support[0].docs && <Typography variant="body2">📎제출서류:</Typography>} 
                  {message.support[0].docs && message.support[0].docs.map((doc) => (
                    <Box sx={{display: 'flex'}}><Typography variant="body2">-</Typography><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>{doc}</Typography></Box>
                  ))} */}
                  
                </Box>
              
                
              ):null}
            
          </Paper>
        </Box>
      </Box>
    );
  };