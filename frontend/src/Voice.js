import { Button, Box, TextField, ThemeProvider } from '@mui/material';
import React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import BasicCard from './layout/BasicCard';
import { theme } from "./theme";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Message } from "./message";
import { useDispatch, useSelector } from 'react-redux';
import { SET_ANSWER, SET_COUNT, SET_SUPPORT_LIST, SET_VOICE_COUNT, SET_SUMMARY, SET_JIMI } from './action/action';
// import { getSpeech } from './tts';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';

import { subRegionList } from './Intro';

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
    const [isListening, setIsListening] = useState(false);
    // const [jimi, setJimi] = React.useState([]);
    
    const [userText, setUserText] = React.useState('')

    const [audioState, setAudioState] = useState(1) // 1: 녹음 시작 2: 답변 받는중 3: 로딩중

    // const [mediaRecorder, setMediaRecorder] = useState()
    const [audioCtx, setAudioCtx] = useState()

    const dispatch = useDispatch()
    const voiceCount = useSelector((state) => state.voiceCount)
    const supports = useSelector((state) => state.supportList)
    const summary = useSelector((state) => state.summary)
    const firstJimi = useSelector((state) => state.firstJimi)
    const jimi = useSelector((state)=>state.jimi)
    
    const [isSpeechOnEnd, setIsSpeechOnEnd] = useState(false)
    const [isUserOff, setIsUserOff] = useState(false)

    const messageContainerRef = useRef();

    const startAudio = new Audio('/start.mp3');
    const endAudio = new Audio('/end.mp3')

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
        setIsListening(listening)
      }, [listening])

    useEffect(()=> {
        // const lastItem = existingJimi
        
        setUserText(transcript)
        // console.log("hihi:", transcript)
        if (transcript && listening){ //transcript 없어진후 -> listening: false
            const lastItem = jimi[jimi.length - 1]
            var result
            if (lastItem.sender === 'user') {

                const updatedJimi = jimi.slice(0, -1)
                result =  [...updatedJimi, {text: transcript, sender: 'user'}]
            } else {
                result =  jimi
            }
            dispatch({
                type: SET_JIMI,
                data: result
            })
        }
    }, [transcript])

    useEffect(()=>{
        //console.log('yehe')
        if (userText && !listening) {
            // setJimi((existingJimi) => [...existingJimi.slice(0, -1), {text: userText, sender: 'user'}])
            stream.getAudioTracks().forEach(function (track) {
                track.stop();
            });
            media.stop();
            // 메서드가 호출 된 노드 연결 해제
            analyser.disconnect();
            audioCtx.createMediaStreamSource(stream).disconnect();
    
            media.ondataavailable = function (e) {
                setAudioUrl(e.data);
                setOnRec(true);
            };
            setAudioState(3)
            endAudio.play()

            dispatch({
                type: SET_JIMI,
                data: [...jimi.slice(0, -1), {text: userText, sender: 'user'}]
            })
            setUserText('')
        }
    }, [listening])

    const getSpeech = (text) => {
        let voices = [];
      
        //디바이스에 내장된 voice를 가져온다.
        const setVoiceList = () => {
          voices = window.speechSynthesis.getVoices();
        };
      
        setVoiceList();
    
        //console.log(voices)
      
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          //voice list에 변경됐을때, voice를 다시 가져온다.
          window.speechSynthesis.onvoiceschanged = setVoiceList;
        }
      
        const speech = (txt) => {
          const lang = "ko-KR";
          const utterThis = new SpeechSynthesisUtterance(txt);
      
          utterThis.lang = lang;
          utterThis.rate = 0.9;
      
          /* 한국어 vocie 찾기
             디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
          */
          const kor_voice = voices.find(
            (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
          );
      
          //힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
          if (kor_voice) {
            utterThis.voice = kor_voice;
            //console.log('yes!')
          } else {
            //console.log('no!')
            return;
          }
          if (text){
            utterThis.onstart = () => {
                setIsSpeechOnEnd(false)
                setIsUserOff(false)
            }
            utterThis.onend = () => {
                //onRecAudio()
                setIsSpeechOnEnd(true)
            }
          }
          //utterance를 재생(speak)한다.
          window.speechSynthesis.speak(utterThis);
        };
      
        speech(text);
      };


    const onRecAudio = () => {
        // setIsAudioEnd(true)
        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        startAudio.play()
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // setJimi((existingJimi) => [...existingJimi, {text: '', sender: 'user'}])
        dispatch({
            type: SET_JIMI,
            data: [...jimi, {text: '', sender: 'user'}]
        })
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
            // setMediaRecorder(new MediaRecorder(stream)) 
            // react-speech-recognition
            SpeechRecognition.startListening()
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
        
            makeSound(stream);

            setAudioCtx(audioCtx)
            analyser.onaudioprocess = function (e) {
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 15) {
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
                    setAudioState(3)
                    endAudio.play()
                } 
            }
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
        setAudioState(1)
        setIsUserOff(true)
        // setIsAudioEnd(true)
        
    };

    const userTextChange = (userTextData) => {
        // console.log(jimi)
        // console.log(jimi.slice(0,-1), userTextData)
        dispatch({
            type: SET_JIMI,
            data: [...jimi.slice(0,-1), {text: userTextData, sender: 'user'}]
        })
    }

    useEffect(()=> {

        if (jimi.length> 0 && jimi.slice(-1)[0].sender === 'bot' && isSpeechOnEnd && !isUserOff){
            setIsSpeechOnEnd(false)
            onRecAudio()
        }
    }, [jimi, isSpeechOnEnd])
    
    useEffect(() => {
        if (audioUrl){
            onSubmitAudioFile();
        }
      }, [audioUrl]); // audioUrl 상태가 변경될 때만 실행
    const onSubmitAudioFile = useCallback(async() => {
        // if (audioUrl) {
        //     console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
        //     //audioUrl.name = "request.wav"
        // }
        //console.log(audioUrl)
        // File 생성자를 사용해 파일로 변환
        const username = localStorage.getItem("username")
        const sound = new File([audioUrl], username +".wav", { lastModified: new Date().getTime(), type: "audio" });
        // console.log(sound); // File 정보 출력

        // const audioResponse = await fetch(audioUrl);
        // const audioBlob = await audioResponse.blob();
        // audioBlob.name = 'request.wav'
        const modifiedJimi = jimi.filter(item => !item.support).map(item => {
            const content = item.text;
            const role = item.sender === 'bot' ? 'assistant' : item.sender;
            return { content, role}; // 여기서 link도 함께 복사하거나 유지합니다.
        });

        const jsonData = modifiedJimi.length>11?modifiedJimi.slice(-11,-1):modifiedJimi.slice(0,-1)

        const formData = new FormData();
        formData.append("file", sound)
        formData.append("history", new File([JSON.stringify(jsonData)], username+".json"));
        //console.log(formData)
        try {
            const response = await fetch(`${apiEndPoint}/api/voice/chat`,{
                method: "POST",
                body: formData
            })
            if (response.ok) {
                const data = await response.json();
                userTextChange(data.userText)
                getSpeech('')
                if (data.function === 'get_api_service_list') {
                    // chktype1 어레이 필터링하여 원하는 결과 생성
                    const filteredChktype1 = [];

                    // chktype1 어레이의 첫 번째 아이템 가져오기
                    const firstItem = data.serviceParams.sidocode[0];

                    // 첫 번째 아이템을 스페이스로 분할
                    const [region1, region2] = firstItem.split(' ');

                    if (region1 === region2 || region2 === '전체') {
                    // 앞과 뒤의 내용이 같으면 해당 지역의 정보를 가져와서 결과에 추가
                        const regionInfo = subRegionList[region1];
                        if (regionInfo) {
                            const subRegions = regionInfo.map(obj => Object.keys(obj)[0]);
                            // "서울특별시"를 앞에 붙여서 결과 어레이에 추가
                            const formattedSubRegions = subRegions
                                .filter(subRegion => subRegion !== "전체") // "전체"인 경우 필터링
                                .map(subRegion => `${region1} ${subRegion}`);
                            filteredChktype1.push(...formattedSubRegions);
                        }
                    }
                    if (data.serviceParams.nextPage) {
                        fetch(`${apiEndPoint}/api/service_list`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                keyword: data.serviceParams.keyword,
                                count: voiceCount+1,
                                chktype1: data.serviceParams.chktype1,
                                sidocode: region1===region2?filteredChktype1:data.serviceParams.sidocode,
                                svccd: data.serviceParams.svccd,
                                voice: 1
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            
                            dispatch({
                                type: SET_VOICE_COUNT,
                                data: voiceCount+1
                            })
                            dispatch({
                                type: SET_SUPPORT_LIST,
                                data: data.support
                            })
                            // setJimi((existingJimi) => [...existingJimi, {text: data.voiceAnswer, sender: 'bot'}])
                            dispatch({
                                type: SET_JIMI,
                                data: [...jimi, {textArray: data.supportArray, sender: 'bot', text: data.voiceAnswer}]
                            })

                            getSpeech(data.voiceAnswer)
                            setAudioState(4)
                        })    
                    } else if (data.serviceParams.prevPage){
                        fetch(`${apiEndPoint}/api/service_list`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                keyword: data.serviceParams.keyword,
                                count: voiceCount-1,
                                chktype1: data.serviceParams.chktype1,
                                sidocode: region1===region2?filteredChktype1:data.serviceParams.sidocode,
                                svccd: data.serviceParams.svccd,
                                voice: 1
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            
                            dispatch({
                                type: SET_VOICE_COUNT,
                                data: voiceCount-1
                            })
                            dispatch({
                                type: SET_SUPPORT_LIST,
                                data: data.support
                            })
                            // setJimi((existingJimi) => [...existingJimi, {text: data.voiceAnswer, sender: 'bot'}])
                            dispatch({
                                type: SET_JIMI,
                                data: [...jimi, {textArray: data.supportArray, sender: 'bot', text: data.voiceAnswer}]
                            })
                            getSpeech(data.voiceAnswer)
                            setAudioState(4)
                        })    
                    } else {
                        fetch(`${apiEndPoint}/api/service_list`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                keyword: data.serviceParams.keyword,
                                count: 0,
                                chktype1: data.serviceParams.chktype1,
                                sidocode: region1===region2?filteredChktype1:data.serviceParams.sidocode,
                                svccd: data.serviceParams.svccd,
                                voice: 1
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            dispatch({
                                type: SET_VOICE_COUNT,
                                data: 0
                            })
                            dispatch({
                                type: SET_SUPPORT_LIST,
                                data: data.support
                            })
                            // setJimi((existingJimi) => [...existingJimi, {text: data.voiceAnswer, sender: 'bot'}])
                            dispatch({
                                type: SET_JIMI,
                                data: [...jimi, {textArray: data.supportArray, sender: 'bot', text: data.voiceAnswer}]
                            })
                            getSpeech(data.voiceAnswer)
                            setAudioState(4)
                        })                 
                    }
                } else if (data.function === 'get_number') {
                    // console.log(supports)
                    fetch(`${apiEndPoint}/api/chat?serviceId=${supports[data.getChatParams.serviceNumber-1].serviceId}&voice=1`)
                    .then(response => response.json())
                    .then(data => {
                        
                        dispatch({
                            type: SET_SUMMARY,
                            data: data.summary
                        })
                        // setJimi((existingJimi) => [...existingJimi, {text: data.voiceAnswer, sender: 'bot'}])
                        dispatch({
                            type: SET_JIMI,
                            data: [...jimi, {text: data.voiceAnswer, sender: 'bot'}]
                        })
                        getSpeech(data.voiceAnswer)
                        setAudioState(4)
                    })
                } else if (data.function === 'post_api_chat') {
                    const modifiedJimi = jimi.filter(item => !item.support).map(item => {
                        const content = item.text;
                        const role = item.sender === 'bot' ? 'assistant' : item.sender;
                        return { content, role}; // 여기서 link도 함께 복사하거나 유지합니다.
                    });
                    fetch(`${apiEndPoint}/api/chat`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            username: localStorage.getItem("username"),
                            question: data.postChatParams.question,
                            history: modifiedJimi.length>11?modifiedJimi.slice(-11, -1):modifiedJimi.slice(0, -1),
                            summary: summary,
                            voice: 1
                        })
                    }).then(response => response.json())
                    .then(data => {
                        // setJimi((existingJimi) => [...existingJimi, {text: data.voiceAnswer, link: data.links, sender: 'bot'}])
                        
                        dispatch({
                            type: SET_JIMI,
                            data: [...jimi, {text: data.voiceAnswer, link: data.links, sender: 'bot'}]
                        })
                        getSpeech(data.voiceAnswer)
                        setAudioState(4)
                    })
                } else if (data.voiceAnswer) {
                    
                    dispatch({
                        type: SET_JIMI,
                        data: [...jimi, {text: data.voiceAnswer, link: data.links, sender: 'bot'}]
                    })
                    getSpeech(data.voiceAnswer)
                    setAudioState(4)
                }
                // setJimi((existingJimi) => [...existingJimi, {text: data.transcript, sender: 'bot'}])
                // console.log('가져온 값:', data.transcript);
              } else {
                console.error('파일 업로드 실패:', response.statusText);
              }
        } catch (error) {
            console.log(error)
        } finally {
            //setJimi((existingJimi) => [...existingJimi, {text: 1, sender: 'bot'}])
            //setAudioState(1)
        }
        }, [audioUrl]);
    
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
        {/* <p>{console.log("여기서는?", listening)}</p> */}
        <BasicCard>
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, minWidth: 120 }} 
        ref={messageContainerRef}
        >
            {/* {console.log(jimi)} */}
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
            <ThemeProvider theme={theme}>

              {
                audioState === 1 &&
                <Button
                fullWidth
                variant="contained"
                sx={{height: '100%', fontSize: '3vh', color: 'white'}}
                onClick={onRecAudio}
                color='deepDarkViolet'
              ><KeyboardVoiceIcon fontSize='large'/>시작</Button>}

                {audioState === 2 && <Button
                fullWidth
                variant="contained"
                sx={{height: '100%', fontSize: '3vh'}}
                // onClick={offRecAudio}
                color='success'
              ><RecordVoiceOverIcon fontSize='large' sx={{mr: 1}}/>음성 듣는 중</Button>}

              {audioState === 3 && 
              <Button
              fullWidth
              variant="contained"
              sx={{height: '100%', fontSize: '3vh' }}
            //   color='secondary'
            //   disabled
            ><GraphicEqIcon fontSize='large'sx={{mr: 1}}/>답변 생성 중</Button>}

            {audioState === 4 &&<Button
                fullWidth
                variant="contained"
                sx={{height: '100%', fontSize: '3vh'}}
                onClick={offRecAudio}
                color='yellow'
              ><VoiceOverOffIcon fontSize='large' sx={{mr: 1}}/>대화 멈추기</Button>
            }
            </ThemeProvider>
          </Box>
          </Box>
        </BasicCard>
    </div>
  )
}

export default Voice