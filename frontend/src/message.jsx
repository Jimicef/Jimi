import * as React from "react";
import {Box, TextField, Button, Typography, Avatar, Grid, Paper, Card, ThemeProvider} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from '@mui/icons-material/Chat';
import FaceIcon from '@mui/icons-material/Face';
import { theme } from "./theme";

export const Message = ({ message, handleQuestion, handleTarget, handleContent, handleDocs, handleSelection, handleWay }) => {
    const [viewMore, setViewMore] = React.useState(false)
  
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
              <><Typography variant="body1">{message.text}</Typography></>
            }
            <Box>
              {(message.link && message.link.length > 0 && message.link[0] !== 'None') && <br/> }
              {(message.link && message.link.length > 0) && message.link.map((link)=>(
                link !== 'None' &&<Box sx={{}}><Typography variant="body2" onClick={()=>{window.open(link)}} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, wordBreak: 'break-word'}}>📎{link}</Typography></Box>
              ))}
            </Box>
            {/* {console.log(Boolean(message.support)== false)} */}
            {(message.support) ? (
              
                <Box>
                  {/* {console.log("here: ",message.support)} */}
                  {message.support.institution && <Typography variant="body2" sx={{ display: "inline-block", borderRadius: 3, bgcolor: "#DAD2E9", px: 1, mb: 1}}>{message.support.institution}</Typography>}
                  {message.support.title && <Typography variant="body1" sx={{fontWeight: 'bold'}}>{message.support.title}</Typography>}
                  
                  {message.support.description ? <Typography variant="body1">{message.support.description}<br/><br/></Typography>:<><br/><br/></>}
                  {viewMore === false && <><Typography variant="body2" onClick={()=> {setViewMore(true)}} sx={{display: 'inline-block', color: 'grey.600', borderBottom: '1px solid grey.500', "&:hover": {color:"grey.500", cursor: 'pointer'}}}>▼ 더보기</Typography><br/><br/></>}
                  
                  {viewMore &&message.support.dueDate && <><Typography variant="body2" sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>🗓️신청기간 </Box>{message.support.dueDate}</Typography><br/><br/></>}
                  {/* {message.support.institution && <Typography variant="body2">🏢소관기관: {message.support.institution}<br/><br/></Typography>} */}
                  {viewMore &&message.support.format && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>⚙️지원형태 </Box> {message.support.format}</Typography><br/><br/></>}
                  
                  {viewMore &&message.support.selection && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>✔선정기준 </Box>{message.support.selection.length>150?message.support.selection.slice(0, 150)+"⋯":message.support.selection}</Typography><br/></>}
                  {viewMore &&(message.support.selection && message.support.selection.length>150) &&<><Typography variant="body2" onClick={handleSelection}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>선정기준 전체보기</Typography><br/></>}
                  {viewMore &&message.support.selection && <br/>}

                  {viewMore &&message.support.target && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>👤지원대상 </Box>{message.support.target.length>150?message.support.target.slice(0, 150)+"⋯":message.support.target}</Typography><br/></>}
                  {viewMore &&(message.support.target && message.support.target.length>150) && <><Typography variant="body2" onClick={handleTarget}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>지원대상 전체보기</Typography><br/></>}
                  {viewMore &&message.support.target &&<br/>}

                  {viewMore &&message.support.content && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>✍🏻지원내용 </Box> {message.support.content.length>150?message.support.content.slice(0, 150)+"⋯":message.support.content}</Typography><br/></>}
                  {viewMore &&(message.support.content && message.support.content.length>150) && <><Typography variant="body2" onClick={handleContent}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>지원내용 전체보기</Typography><br/></>}
                  {viewMore &&message.support.content && <br/>}

                  {/* {message.support[0].way && <Typography variant="body2" sx={{fontWeight: 'bold'}}>📑신청방법<br/></Typography>} */}
                  {/* {message.support[0].dueDate && <Typography variant="body2">🗓️신청기간: {message.support[0].dueDate}<br/></Typography>} */}
                  {viewMore &&message.support.rcvInstitution && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>🏠접수기관 </Box> {message.support.rcvInstitution}</Typography><br/><br/></>}
                  {viewMore &&message.support.way && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>✳️신청방법 </Box> {message.support.way.length>150?message.support.way.slice(0, 150)+"⋯":message.support.way}</Typography><br/></>}
                  {viewMore &&(message.support.way && message.support.way.length>150) && <><Typography variant="body2" onClick={handleWay}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>신청방법 전체보기</Typography><br/></>}
                  {viewMore &&message.support.way &&<br/>}

                  {viewMore &&message.support.docs && <><Typography variant="body2"sx={{display: 'inline-block'}}><Box sx={{fontWeight: 'bold', mr: 0.5}}>📑제출서류 </Box>{message.support.docs.length>150?message.support.docs.slice(0, 150)+"⋯":message.support.docs}</Typography><br/></>} 
                  {viewMore &&(message.support.docs && message.support.docs.length>150) &&<><Typography variant="body2" onClick={handleDocs}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#682699"}}><SendIcon sx={{fontSize: "14px", color: "#682699"}}/>제출서류 전체보기</Typography><br/></>}
                  {viewMore &&message.support.docs &&<br/>}
                  {viewMore &&message.support.url && <Typography variant="body2" sx={{ display: 'flex', whiteSpace: 'nowrap'}} ><Box>📎</Box> <Box sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}}} onClick={()=>handleClickUrl(message.support.url)}>{message.support.url}</Box><br/><br/></Typography>}

                  {viewMore && <><Typography variant="body2" onClick={()=> {setViewMore(false)}} sx={{display: 'inline-block', color: 'grey.600', borderBottom: '1px solid grey.500', "&:hover": {color:"grey.500", cursor: 'pointer'}}}>▲ 숨기기</Typography><br/><br/></>}
                    {/* <Typography variant="body2" onClick={()=>handleQuestion("지원대상이 맞는지 확인하기")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                    지원대상이 맞는지 확인하기
                    </Typography>
                    <br/> */}
                  <Typography variant="body2" onClick={()=>handleQuestion("이 서비스를 신청하려면 어떻게 해야 하나요?")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                  이 서비스를 신청하려면 어떻게 해야 하나요?                 </Typography>
                    <br/>
                  <Typography variant="body2" onClick={()=>handleQuestion("이 서비스의 지원 대상은 누구인가요?")}sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>이 서비스의 지원 대상은 누구인가요?</Typography>
                  <br/>
                  <Typography variant="body2" onClick={()=>handleQuestion("이 서비스를 신청하기 위해 필요한 서류는 어떤 것들인가요?")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                  이 서비스를 신청하기 위해 필요한 서류는 어떤 것들인가요?               </Typography>
                  <br/>
                  <Typography variant="body2" onClick={()=>handleQuestion("이 서비스의 지원 금액은 어떻게 되나요?")} sx={{"&:hover": {color:"grey.500", cursor: 'pointer'}, display: "inline-block", alignItems:'center', color:"#1A66CC"}}><SendIcon sx={{fontSize: "14px", color: "#1A66CC"}}/>
                  이 서비스의 지원 금액은 어떻게 되나요?              </Typography>
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