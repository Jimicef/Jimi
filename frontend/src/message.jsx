import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, Card} from "@mui/material";

export const Message = ({ message }) => {
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
              message.support.length == 1 ? (
                <Box>
                  
                  {console.log(message.support[0].docs)}
                  {message.support[0].title && <Typography variant="body1">{message.support[0].title}</Typography>}
                  {message.support[0].description && <Typography variant="body1">{message.support[0].description}<br/><br/></Typography>}
                  {message.support[0].dueDate && <Typography variant="body2">🗓️신청기간: {message.support[0].dueDate}<br/><br/></Typography>}
                  {message.support[0].format && <Typography variant="body2">⚙️지원형태: {message.support[0].format}<br/><br/></Typography>}
                  {message.support[0].target && <Typography variant="body2">👤지원대상: {message.support[0].target}<br/><br/></Typography>}
                  {message.support[0].content && <Typography variant="body2">✍🏻지원내용: {message.support[0].content}<br/><br/></Typography>}
                  {/* {message.support[0].way && <Typography variant="body2" sx={{fontWeight: 'bold'}}>📑신청방법<br/></Typography>} */}
                  {/* {message.support[0].dueDate && <Typography variant="body2">🗓️신청기간: {message.support[0].dueDate}<br/></Typography>} */}
                  {message.support[0].way && <Typography variant="body2">✳️신청방법: {message.support[0].way}<br/><br/></Typography>}
                  
                  {message.support[0].docs && <Typography variant="body2">📎제출서류:</Typography>} 
                  {message.support[0].docs && message.support[0].docs.map((doc) => (
                    <Box sx={{display: 'flex'}}><Typography variant="body2">-</Typography><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>{doc}</Typography></Box>
                  ))}
                  
                </Box>
              ):(
                message.support.length > 1 && 
                <Box sx={{display: 'flex', flexWrap:"wrap"}}>
                  {message.support.map((sup) =>(
                    <Card sx={{width: "40%", mr: 2, p: 1, mb: 1}}>
                      <Typography variant="body1" sx={{fontWeight: 'bold'}}>{sup.title}</Typography>
                      <Typography variant="body1">{sup.description}</Typography>
                      <br />
                      <Typography variant="body2">🗓️신청기간: {sup.dueDate}</Typography>
                      <Typography variant="body2">⚙️지원형태: {sup.format}</Typography>
                      <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>👤지원대상</Typography></Box>
                      <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>✍🏻지원내용</Typography></Box>
                      <Box><Typography variant="body2" sx={{borderBottom: "1px solid", diplay: "inline-block", width: 'fit-content', color: 'violet'}}>📑신청방법</Typography></Box>
                    </Card>
                  ))}
                </Box>
              )):null}
            
          </Paper>
        </Box>
      </Box>
    );
  };