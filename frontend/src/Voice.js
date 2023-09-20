import { Button, Box, TextField, ThemeProvider } from '@mui/material';
import React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import BasicCard from './layout/BasicCard';
import { theme } from "./theme";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Message } from "./message";

const Voice = () => {

    var apiEndPoint;
    if (process.env.NODE_ENV == 'development') {
        apiEndPoint = process.env.REACT_APP_SWAGGER_API
    }
    else {
        apiEndPoint = `${process.env.REACT_APP_AWS_SERVER}`
    }

    const [stream, setStream] = useState();
    const [media, setMedia] = useState();
    const [onRec, setOnRec] = useState(true);
    const [source, setSource] = useState();
    const [analyser, setAnalyser] = useState();
    const [audioUrl, setAudioUrl] = useState();
    const [jimi, setJimi] = React.useState([]);
    
    const [userText, setUserText] = React.useState('')

    const [audioState, setAudioState] = useState(1) // 1: 녹음 시작 2: 녹음 중지 3: 로딩중
    const messageContainerRef = useRef();

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      };

      useEffect(() => {
        scrollToBottom();
      }, [jimi]);
      
    // react-speech-recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    
    // if (!browserSupportsSpeechRecognition) {
    // return <span>Browser doesn't support speech recognition.</span>;
    // }

    useEffect(()=> {
        // const lastItem = existingJimi

        setUserText(transcript)
        console.log("hihi:", transcript)
        if (transcript && listening){ //transcript 없어진후 -> listening: false

            setJimi((existingJimi) => {
                const lastItem = existingJimi[existingJimi.length - 1]
                if (lastItem.sender === 'user') {

                    const updatedJimi = existingJimi.slice(0, -1)
                    return [...updatedJimi, {text: transcript, sender: 'user'}]
                } else {
                    return existingJimi
                }
            })
        }
    }, [transcript])

    useEffect(()=>{
        if (userText && !listening) {
            setJimi((existingJimi) => [...existingJimi.slice(0, -1), {text: userText, sender: 'user'}])
            setUserText('')
        }
    }, [listening])

    const onRecAudio = () => {
        // setIsAudioEnd(true)
        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setJimi((existingJimi) => [...existingJimi, {text: '', sender: 'user'}])
        
        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);
        setAnalyser(analyser);

        // let speakingTimer

        function makeSound(stream) {
        // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
            const source = audioCtx.createMediaStreamSource(stream);
            setSource(source);
            
            // AudioBufferSourceNode 연결
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            //작할 때 타이머 시작
            // speakingTimer = setTimeout(() => {
            //     // 5초 동안 말하지 않았으므로 녹음 중지
            //     offRecAudio();
            // }, 5000); // 5초 (5000 밀리초)
        }

    
        
        // 마이크 사용 권한 획득 후 녹음 시작
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);   
            // react-speech-recognition
            SpeechRecognition.startListening()
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
        

            makeSound(stream);
            // 음성 녹음이 시작됐을 때 onRec state값을 false로 변경
            analyser.onaudioprocess = function (e) {
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 180 || (!listening && e.playbackTime > 5)) {
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    // 메서드가 호출 된 노드 연결 해제
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();
            
                    mediaRecorder.ondataavailable = function (e) {
                        setAudioUrl(e.data);
                        setOnRec(true);
                    };
                    // setAudioState(3)
                    // setIsAudioEnd(true)
                    // if (transcript) {

                    // setJimi((existingJimi) => [...existingJimi, {text: userText, sender: 'user'}])
                    // }
                } 
                
                else {
                setOnRec(false);
                }
            };
            setAudioState(2)
            }
        );
    };
    const offRecAudio = async() => {
        // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
        media.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
        };
    
        // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
        stream.getAudioTracks().forEach(function (track) {
            track.stop();
        });
        SpeechRecognition.stopListening()
    
        // 미디어 캡처 중지
        media.stop();
        
        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();
        setAudioState(3)
        // setIsAudioEnd(true)
        setJimi((existingJimi) => [...existingJimi, {text: transcript, sender: 'user'}])
        
    };
    useEffect(() => {
        if (audioUrl){
            onSubmitAudioFile();
        }
      }, [audioUrl]); // audioUrl 상태가 변경될 때만 실행
    const onSubmitAudioFile = useCallback(async() => {
        if (audioUrl) {
            console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
            //audioUrl.name = "request.wav"
        }
        console.log(audioUrl)
        // File 생성자를 사용해 파일로 변환
        const sound = new File([audioUrl], "request.wav", { lastModified: new Date().getTime(), type: "audio" });
        // console.log(sound); // File 정보 출력

        // const audioResponse = await fetch(audioUrl);
        // const audioBlob = await audioResponse.blob();
        // audioBlob.name = 'request.wav'
        

        const formData = new FormData();
        formData.append("file", sound)
        console.log(formData)
        try {
            const response = await fetch(`${apiEndPoint}/api/voice_chat`,{
                method: "POST",
                body: formData
            })
            if (response.ok) {
                const data = await response.json();
                setJimi((existingJimi) => [...existingJimi, {text: data.transcript, sender: 'bot'}])
                console.log('가져온 값:', data.transcript);
              } else {
                console.error('파일 업로드 실패:', response.statusText);
              }
        } catch (error) {
            console.log(error)
        } finally {
            //setJimi((existingJimi) => [...existingJimi, {text: 1, sender: 'bot'}])
            setAudioState(1)
        }
        }, [audioUrl]);
    const fileInput = React.useRef(null);

    const handleButtonClick = e => {
        fileInput.current.click();
    };
    
    const handleChange = e => {
        console.log(e.target.files[0]);
    };

    // const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];
    //     console.log(selectedFile)
    //     if (selectedFile) {
    //       sendFile(selectedFile); // 파일을 전송하는 함수 호출
    //     }
    //   };

    const fetchCheck = async() => {
        const audioFilePath = '/0001.wav';

        // fetch를 사용하여 오디오 파일을 가져옵니다.
        const audioResponse = await fetch(audioFilePath);

        // 오디오 파일을 Blob 형식으로 변환합니다.
        const audioBlob = await audioResponse.blob();
        audioBlob.name = 'sample.wav'
        console.log(audioBlob)

        // const sound = new File([audioFilePath], "soundBlob.wav", { lastModified: new Date().getTime(), type: "audio/mpeg" });
        // console.log(sound)
        // FormData 객체를 생성하고 오디오 파일을 추가합니다.
        const formData = new FormData();
        formData.append('file', audioBlob);
        try {
            const response = await fetch(`${apiEndPoint}/api/voice_chat`,{
                method: "POST",
                // headers:{
                //     "Content-Type": "multipart/form-data"
                // },
                body: formData
            })
            if (response.ok) {
                const data = await response.json();
                console.log('가져온 값:', data.transcript);
              } else {
                console.error('파일 업로드 실패:', response.statusText);
              }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
        {/* <Button onClick={handleButtonClick}>파일 업로드</Button>
      <input type="file"
             ref={fileInput}
             onChange={handleFileChange}
             style={{ display: "none" }} /> */}
        {/* <Button variant='contained' onClick={fetchCheck}>fetch 확인</Button>
        <Button variant="contained" onClick={onRec ? onRecAudio : offRecAudio}>녹음</Button>
        <Button variant='outlined' onClick={onSubmitAudioFile}>결과 확인 </Button> */}
        {/* <p>{transcript}</p>
        <p>{listening?"듣는중":"멈췄음"}</p> */}
        <BasicCard>
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 120 }} 
        ref={messageContainerRef}
        >
        {jimi.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </Box>
      <Box sx={{display:'flex', p: 2, backgroundColor: "background.default", minWidth: 120 }}>
        {/* <Grid container spacing={2}> */}
          {/* <Box sx={{width: "85%", mr: 2}}>
            <TextField
            //   size="Normal"
              fullWidth
              placeholder="해당 지원금 제도에 대해 무엇이든 질문해주세요"
              variant="outlined"
              value={transcript}
            //   onChange={handleInputChange}
            //   onKeyDown={handleKeyDown}
            />
          </Box> */}
          <Box sx={{width: '100%', height: '13vh'}}>
            {/* <ThemeProvider theme={theme}> */}

              {
                audioState === 1 &&
                <Button
                fullWidth
                variant="contained"
                sx={{height: '100%', fontSize: '3vh'}}
                onClick={onRecAudio}
                color='secondary'
              ><KeyboardVoiceIcon fontSize='large'/>시작</Button>}

                {audioState === 2 && <Button
                fullWidth
                variant="contained"
                sx={{height: '100%', fontSize: '3vh'}}
                // onClick={offRecAudio}
                color='error'
              ><MicOffIcon fontSize='large'/>답변 받는 중</Button>}

              {audioState === 3 && 
              <Button
              fullWidth
              variant="contained"
              sx={{height: '100%', fontSize: '3vh'}}
              color='secondary'
              disabled
            ><KeyboardVoiceIcon fontSize='large'/>시작</Button>}
            
              
      
              
            {/* </ThemeProvider> */}
          </Box>
          </Box>
        </BasicCard>
    </div>
  )
}

export default Voice