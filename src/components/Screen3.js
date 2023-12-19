//
//  Node.js v18.18.0 npm 10.2.1
//  File: Screen3.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application UI.
//

import React, { useState, useEffect, useRef } from "react";
import {
  ButtonGroup,
  Paper,
  Button,
  Typography,
  styled,
  Box,
  Modal,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {isMobile, browserVersion} from 'react-device-detect';
import MicNoneIcon from "@mui/icons-material/MicNone";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import platform from "platform";
import RecordRTC from 'recordrtc'
import { useLocation } from "react-router-dom";
import data_file from "../assets/files/config.json";
import Progressbar_desktop from "./Progressbar_desktop";
import Progressbar_mobile from "./Progressbar_mobile";
import CircularProgress from '@mui/material/CircularProgress';

export default function Screen3() {
  /*
    Screen3
    ~~~~~~~~~~~~~~~~~
    
    This Component displays all phrase with record button.
  */    
  const navigate = useNavigate();
  const [phraseList, setphraseList] = useState([]);
  const [name, setName] = useState("");
  const [timerState, settimerState] = useState("");
  const [timerBtnClick, settimerBtnClick] = useState(0);
  const stopRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordRTC, setRecordRTC] = useState(null);
  const [initialCount, setInitialCount] = useState(null);
  const [nextcount, setNextCount] = useState(null);
  const [fetchNextLoop, setFetchNextLoop] = useState(0);
  const [thankyouBtnPos, setthankyouBtnPos] = useState(0);
  const location = useLocation();
  const params = useParams();
  const [streamState, setStreamState] = useState(null);
  const [Tokenopen, setTokenopen] = useState(false);  
  const [freeze, setfreeze] = useState(false);
  const [progressbarText, setprogressbarText] = useState("Lets Go!"); 

  // style for ms token error message
  const ms_style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #e74c3c',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  // record RTC variable for recording audio 
  const initRecordRTC = async () => {
  
      var params = { audio: true, video: false };
      await navigator.mediaDevices.getUserMedia(params).then(
        (stream) => {
          setStreamState(stream)
          console.log('Got the stream - ', stream)
      const recorder = RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        //sampleRate: 44100
      })
      setRecordRTC(recorder);
        }
      )
    }
    

  // On initial load
  useEffect(() => {

    // clear previous screen load VCXP-18045
    localStorage.removeItem("S2_firstLoadDone")

    // Set initial and next count for showing Recording blocks
    setInitialCount(0);
    setNextCount(5);

    // Initialize record RTC for recording audio 
    initRecordRTC();

    // Check campaign key is available in config file 
    // else navigate to 404 page
    let path_list = location.pathname.split("/");
    let camp_val = "";
    for (let i = 0; i < path_list.length; i++) {
      if (data_file.hasOwnProperty(path_list[i])) {
        camp_val = path_list[i];
      }
    }
  
    if (camp_val == "") {
      navigate("/404");
    }

    // On Refresh navigate to screen1 
    if (localStorage.getItem('S3_firstLoadDone') === null) {
      // If it's the first load, set the flag in local storage to true and reload the page
      localStorage.setItem('S3_firstLoadDone', 1);
      console.log('This is the initial load');
    } else {
      let s3Ref = localStorage.getItem("S3_firstLoadDone")
      localStorage.setItem("S3_firstLoadDone",parseInt(s3Ref) + 1)
      s3Ref = localStorage.getItem("S3_firstLoadDone")
      if(s3Ref == 3){
          localStorage.clear()
          console.log('This is a page refresh');
          if(recordRTC){
            recordRTC.destroy()
          }      
        navigate("/" + params.userId )
      } 

    }

    // check session id present in local storage
    // if not present navigate to screen1 page
    const check_session = localStorage.getItem('vct_session_id');
    if(check_session == null){
      if(recordRTC){
        recordRTC.destroy()
      }      
      navigate("/" + params.userId)
    }

    // Set the browser name
    setName(platform.name);

    // Get Phrase list from loal storage
    let phrase_fetched = [];
    try {
      if(localStorage.getItem("vct_phrase_list") !== undefined){
        phrase_fetched = JSON.parse(localStorage.getItem("vct_phrase_list"));
      } else {
        for (let i = 0; i < 50; i++){
          phrase_fetched.push("")
        }
      }
      
      // Create list of object for each phrase
      // Object containing values for displaying and hiding the view
      if(localStorage.getItem("vct_phrase_list") !== undefined){
        //Runs only on the first render
        for (let i = 0; i < 50; i++) {
          if (i === 0) {
            phraseList.push({
              recordButtonDisplay: "",
              stopButtonDisplay: "none",
              readyGreenTextDisplay: "",
              recordingRedTextDisplay: "none",
              recordBoxDisplay: "inline-block",
              completedBoxDisplay: "none",
              phraseBoxDisplay: "none",
              phraseText: phrase_fetched[i],
              prevRecorded: false,
              blobUrldata: "",
              box_no: i,
            });
          } else {
            phraseList.push({
              recordButtonDisplay: "none",
              stopButtonDisplay: "none",
              readyGreenTextDisplay: "none",
              recordingRedTextDisplay: "none",
              recordBoxDisplay: "none",
              completedBoxDisplay: "none",
              phraseBoxDisplay: "",
              phraseText: phrase_fetched[i],
              prevRecorded: false,
              blobUrldata: "",
              box_no: i,
            });
          }
        }        
      
      }

      // set state of phraselist
      setphraseList([...phraseList, phraseList]);

    } catch (err) {
      // handle exception
      console.error("An error occurred:", err);
    }


    if (window !== undefined) {
      // browser code
      navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
    }
    

    // Get no_of_phrases from local storage
    // Set thank you button position  
    setthankyouBtnPos(parseInt(localStorage.getItem("no_of_phrases")))

    // set timer for token 
    const interval = setInterval(() => {
      setTokenopen(true);
    }, 1200000); //20*60 = 1200s =1200000ms
    return () => clearInterval(interval);
  }, []);

  // CSS styling for button
  const BlueButton = styled(Button)(({ theme }) => ({
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#ffb500",
    padding: "10px 15px",
    color: "black",
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 600,
    boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#F79F1F",
    },
    "&:disabled": {
      backgroundColor: "gray",
      color: "white",
    },
  }));

  // 
  React.useEffect(() => {
    function strFormat(strIdx) {
      var strVal = JSON.parse(localStorage.getItem("vct_phrase_list"));
      strVal = strVal[strIdx].replace(/[^a-zA-Z0-9 ]/g, "");
      strVal = strVal.replace(/ /g, "_");
      return (strIdx + 1) + "_" + strVal;
    }

    async function uploadVoice() {
      // get curr idx, phrase
      const box_no1 = timerBtnClick;

      let url;
      if (audioBlob) {
        url = URL.createObjectURL(audioBlob);
      }

        // store blob in blobval key in object
        const new_data = phraseList.map((item) =>
        item.box_no === box_no1 ? { ...item, blobUrldata: url } : item
      );
      setphraseList(new_data);
      const audioBlob1 = await fetch(url).then((r) => r.blob());
      const audiofile = new File([audioBlob1], "audiofile.mp3", {
        type: "audio/mpeg",
      });

      const formData = new FormData();
      formData.append("audio_data", audiofile);

      await axios
        .post(
            process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
            // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
            localStorage.getItem("vct_campaign") +
            "/" +
            localStorage.getItem("vct_session_id") +
            "/audiofile?phrase_str=" +
            strFormat(box_no1),
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              'Access-Control-Allow-Origin': '*', 
              'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',             
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Credentials': true,            
              'Authorization': `Bearer ${localStorage.getItem("vct_token")}`
            },
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    if (audioBlob) {
      uploadVoice();
    }
  }, [audioBlob]);


  const handleProgressbar = (count_val) => {

    // set progress bar text
    const pb_text = ["Lets Go!", "Good Going!", "Excellent!", "Nearly There!","Last 10 to go!", "Done!"];
    
    if((parseInt(count_val) >= 0) && (parseInt(count_val) < 10)){
      setprogressbarText(pb_text[0]) //Lets Go!
    }

    if((parseInt(count_val) >= 10) && (parseInt(count_val) < 20)){
      setprogressbarText(pb_text[1]) //Good Going!
    }

    if((parseInt(count_val) >= 20) && (parseInt(count_val) < 30)){
      setprogressbarText(pb_text[2]) //Excellent!
    }
    
    if((parseInt(count_val) >= 30) && (parseInt(count_val) < 40)){
      setprogressbarText(pb_text[3]) //Nearly There!
    }

    if((parseInt(count_val) >= 40) && (parseInt(count_val) < 49)){
      setprogressbarText(pb_text[4]) //Last 10 to go!
    }

    if(parseInt(count_val) === 49){
      setprogressbarText(pb_text[5]) //Done!
    }

  };

  // start recording
  const handleRecordClick = (e) => {
    // console.log(timerBtnClick)

    if(recordRTC){
      recordRTC.reset()
    }

    localStorage.setItem("vct_curr_box", e.target.id);

    const new_data = phraseList.map((item) =>
      item.box_no === parseInt(e.target.id)
        ? {
            ...item,
            recordButtonDisplay: "none",
            stopButtonDisplay: "",
            readyGreenTextDisplay: "none",
            recordingRedTextDisplay: "flex",
          }
        : item
    );

    if (parseInt(e.target.id) >= 1) {
      const prev_data = new_data.map((item) =>
        item.box_no === parseInt(e.target.id) - 1
          ? { ...item, recordBoxDisplay: "none", completedBoxDisplay: "none" }
          : item
      );

      setphraseList(prev_data);
    } else {
      setphraseList(new_data);
    }

    // startRecording();
    if (recordRTC) {
      recordRTC.startRecording();
      setIsRecording(true);
    }

    const timerID = setTimeout(() => {
      stopRef.current.click();
    }, 10000); //miliseconds

    settimerState(timerID)
    // get id (int of block)
    settimerBtnClick(parseInt(e.target.id))

    // Progress bar count
    handleProgressbar(parseInt(e.target.id));

  };

  // stop recording
  async function handleStopClick(e) {

    setFetchNextLoop(timerBtnClick + 1);
    // console.log('firstTime - ', fetchNextLoop)
    if ((timerBtnClick - (timerBtnClick%4)) !== initialCount)
    {if(timerBtnClick === nextcount){
      
        setInitialCount(initialCount);
        setNextCount(nextcount);
      }
      else{

        if(timerBtnClick !== initialCount){
          if((timerBtnClick+1) % 5 == 0){
            setInitialCount(initialCount + 4);
            setNextCount(nextcount + 5);
          }
        }

      }}
  

    clearTimeout(timerState)

    // If First phrase send metadata json
    if (timerBtnClick === 0) {
      const data = {
        campaign_name: params.userId,
        accent: localStorage.getItem("vct_accent_value"),
        session_id: localStorage.getItem("vct_session_id"),
        timestamp: localStorage.getItem("vct_curr_date") + " " + localStorage.getItem("vct_curr_time"),
        browser: name,
        browser_version: browserVersion,
        device: isMobile ? 'mobile' : 'desktop',
        ms_token_id: localStorage.getItem("vct_ms_token"),
        ms_token_title: localStorage.getItem("vct_ms_token_title"),
        language : "English"
      };

      //1. post meta-json file to server
      axios
        .post(
          process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
          // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
            localStorage.getItem("vct_campaign") +
            "/" +
            localStorage.getItem("vct_session_id") +
            "/metadata",
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', 
              'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',             
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Credentials': true,
              'Authorization': `Bearer ${localStorage.getItem("vct_token")}`
            },
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const new_data1 = phraseList.map((item) =>
      item.box_no === timerBtnClick
        ? {
            ...item,
            recordBoxDisplay: "none",
            completedBoxDisplay: "inline-block",
            prevRecorded: true,
          }
        : item
    );

    // Until count not moves to last recording box
    if (timerBtnClick !== 49) {
      const new_data = new_data1.map((item) =>
        item.box_no === timerBtnClick + 1
          ? {
              ...item,
              recordBoxDisplay: "inline-block",
              recordButtonDisplay: "",
              readyGreenTextDisplay: "",
              phraseBoxDisplay: "none",
            }
          : item
      );

      setphraseList(new_data);
    } else {
      setphraseList(new_data1);
    }

    // stopRecording();
    if (recordRTC) {
      recordRTC.stopRecording(() => {
        const blob = recordRTC.getBlob();
        setAudioBlob(blob);
        setIsRecording(false);
      });
    }

    localStorage.setItem("vct_curr_box",timerBtnClick)
  }

  // retry recording and set CSS of that phrase box
  const handleRetryClick = (e) => {
    settimerBtnClick(parseInt(e.target.id))
  
    // progress bar count
    handleProgressbar(parseInt(e.target.id));
    
    const new_data = phraseList.map((item) =>
      item.box_no === parseInt(e.target.id)
        ? {
            ...item,
            recordBoxDisplay: "inline-block",
            recordButtonDisplay: "",
            stopButtonDisplay: "none",
            readyGreenTextDisplay: "",
            recordingRedTextDisplay: "none",
            completedBoxDisplay: "none",
            phraseBoxDisplay: "none",
          }
        : item
    );

    const next_data = new_data.map((item) =>
      item.box_no === parseInt(e.target.id) + 1
        ? {
            ...item,
            recordBoxDisplay: "none",
            completedBoxDisplay: "none",
            phraseBoxDisplay: "",
          }
        : item
    );

    setphraseList(next_data);
  };

  // listen recording
  const handleListenClick = (e) => {

    const audio_src = phraseList[parseInt(e.target.id)].blobUrldata
    // // const audio_src = phraseList[timerBtnClick].blobUrldata
    const tmp = new Audio(audio_src); 
    tmp.play()  
  };


  //tokenexpireBtnClick button click gte new bearer token
  const tokenexpireBtnClick = () => {

    // when button clicked
    // hide token error model
    setTokenopen(false)

    // show circular modal
    setfreeze(true)

    // API for getting JWT token
    var tokenurl =
      process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
      // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
      localStorage.getItem("vct_session_id") +
      "/auth";
    axios
      .get(tokenurl, 
        {
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', 
              'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',             
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Credentials': true
          },
        })
      .then((response) => {
        // As soon as JWT  token received 
        // extract token and set local storage
        const posts = response.data;
        localStorage.setItem("vct_token", posts.token);

        // hide circular model
        setfreeze(false)   
      })
      .catch(function (error) {
        console.log(error);
      });
  
  };

 
  return (
    <Box>

      {/* modal for token expiration */}
      <Modal
        open={Tokenopen}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...ms_style, width: 400 }}>
          <h2 id="parent-modal-title">Error message</h2>

          <Box my={1}>
            <p id="parent-modal-description">
              Session Expired. Please click OK button to renew session.
            </p>
          </Box>

          <Button   
            onClick={tokenexpireBtnClick} 
            variant="outlined">OK</Button>
        </Box>
      </Modal>



      {/* Circular loader view when submit button clicked */}
      <Modal 
        open={freeze}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      </Modal>

      {/* mobile view */}
      <Box
        sx={{ display: { md: "none", xs: "block" }  }}
      >
        <Box px={2.5} pt={2.5} maxWidth={1370}>
          <Box>
            <img src="/logo1.png" alt="stryker logo" width="114px" height="34px" />
          </Box>
        </Box>  
      </Box>

      {/* desktop view */}
      <Box
        sx={{ display: { md: "block", xs: "none" }, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)"  }}
        bgcolor="#ffb500"
      >
        <Box px={5} py={2.6} maxWidth={1370}>
          <Box>
            <img src="/logo1.png" alt="stryker logo" width="148px" height="44px" />
          </Box>
        </Box>  
      </Box>

      <Box p={5} maxWidth={1370}>
        {/* Desktop progress bar */}
        <Box sx={{ display: { md: "block", xs: "none" }}}>
          < Typography variant="body1" component="p" fontSize={18} fontWeight={800} color={"#ffb500"}>
              {progressbarText}
          </Typography>
          <Progressbar_desktop bar_val={timerBtnClick}/>
        </Box>

        {/* mobile view progress bar */}
        <Box sx={{ display: { md: "none", xs: "block" }}}>
          <Progressbar_mobile bar_val={timerBtnClick}/>
          < Typography variant="body1" component="p" fontSize={18} fontWeight={800} color={"#ffb500"}>
              {progressbarText}
          </Typography>          
        </Box>

        {/* desktop texttext */}
        <Box mt={5} sx={{ display: { md: "block", xs: "none" } }}>
          <Typography variant="body1" component="p" fontSize={16} fontWeight={500}>
          Press the record button and say the highlighted phrase. If the phrase contains words that have spaces, please spell the word. <br/> For example, "N I C U" should be pronounced letter by letter.
          </Typography>
        </Box>

        {/* mobile texttext */}
        <Box mt={5} sx={{ display: { md: "none", xs: "block" } }}>
          <Typography textAlign={"center"} variant="body1" component="p" fontSize={16} fontWeight={500}>
          Press the record button and say the highlighted phrase. If the phrase contains words that have spaces, please spell the word. <br/> For example, "N I C U" should be pronounced letter by letter.
          </Typography>
        </Box>

        <Box mt={5}>
          {(() => {
            let container = [];
            for (var i = 0; i < phraseList.length - 1; i++) {
              container.push(
                <Box key={i}>
                  {/* 1 ================ desktop recording box======================== */}
                  <Box sx={{display: { md: "block", xs: "none" }}}>
                    <Box display={phraseList[i].recordBoxDisplay}>
                      <Paper sx={{border: "0.75px solid #CB9200", background: "rgba(255, 245, 219, 0.50)", boxShadow: "0px 1px 7px 0px rgba(255, 181, 0, 0.15)"}} elevation={2}>
                        <Box
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Box px={5} py={2.3}>
                            <Typography variant="h6" component="p" fontSize={16} fontWeight={600}>
                              {phraseList[i].phraseText} 
                            </Typography>

                            <Typography
                              sx={{marginTop:"10px"}}
                              display={phraseList[i].readyGreenTextDisplay}
                              variant="body1"
                              component="p"
                              color="green"
                              fontSize={14}
                              fontWeight={600}
                            >
                              Ready to record!
                            </Typography>

                            <Box
                              sx={{
                                marginTop:"10px",
                                display: phraseList[i].recordingRedTextDisplay,
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                component="p"
                                color="red"
                                fontSize={14}
                                fontWeight={600}
                              >
                                Recording
                              </Typography>
                              <img style={{marginLeft:"10px"}} id="progressimg" src="/rec_logo.svg" alt="flags" width="10px"/>
                            </Box>
                          </Box>

                          <Box sx={{padding: "0px 20px"}}>
                            <BlueButton
                              id={phraseList[i].box_no}
                              onClick={(e) => handleRecordClick(e)}
                              sx={{
                                display: phraseList[i].recordButtonDisplay,
                              }}
                              variant="contained"
                              startIcon={<MicNoneIcon sx={{ fontSize: 40 }} />}
                            >
                              Record
                            </BlueButton>

                            <BlueButton
                              ref={stopRef}
                              id={phraseList[i].box_no}
                              onClick={(e) => handleStopClick(e)}
                              sx={{
                                width: {
                                  display: phraseList[i].stopButtonDisplay,
                                },
                              }}
                              variant="contained"
                              startIcon={<CheckBoxOutlineBlankIcon />}
                            >
                              Stop
                            </BlueButton>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>


                  {/* 1 ================ mobile recording box======================== */}
                  <Box sx={{display: { md: "none", xs: "block" }}}>
                    <Box width="100%" display={phraseList[i].recordBoxDisplay}>
                      <Paper sx={{border: "0.75px solid #CB9200", background: "rgba(255, 245, 219, 0.50)", boxShadow: "0px 1px 7px 0px rgba(255, 181, 0, 0.15)"}} elevation={2}>

                          <Box py={3.4} px={2} display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{flexDirection: "column"}}>
                            <Typography variant="h6" component="p" fontSize={16} fontWeight={600}>
                              {phraseList[i].phraseText}
                            </Typography>

                            <Typography
                              sx={{marginTop:"20px"}}
                              display={phraseList[i].readyGreenTextDisplay}
                              variant="body1"
                              component="p"
                              color="green"
                              fontSize={14}
                              fontWeight={600}
                            >
                              Ready to record!
                            </Typography>

                            <Box
                              sx={{
                                marginTop:"20px",
                                display: phraseList[i].recordingRedTextDisplay,
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                component="p"
                                color="red"
                                fontSize={14}
                                fontWeight={600}
                              >
                                Recording
                              </Typography>
                              <img style={{marginLeft:"10px"}} id="progressimg" src="/rec_logo.svg" alt="flags" width="10px"/>
                            </Box>


                            <BlueButton
                              id={phraseList[i].box_no}
                              onClick={(e) => handleRecordClick(e)}
                              sx={{
                                marginTop:"20px",
                                display: phraseList[i].recordButtonDisplay,
                              }}
                              variant="contained"
                              startIcon={<MicNoneIcon sx={{ fontSize: 40 }} />}
                            >
                              Record
                            </BlueButton>

                            <BlueButton
                              ref={stopRef}
                              id={phraseList[i].box_no}
                              onClick={(e) => handleStopClick(e)}
                              sx={{
                                marginTop:"20px",
                                width: {
                                  display: phraseList[i].stopButtonDisplay,
                                },
                              }}
                              variant="contained"
                              startIcon={<CheckBoxOutlineBlankIcon />}
                            >
                              Stop
                            </BlueButton>

                          </Box>

                      </Paper>
                    </Box>
                  </Box>



                  {/* 2 ================desktop recording box======================== */}
                  <Box sx={{display: { md: "block", xs: "none" }}}>
                    <Box  mb={5} display={phraseList[i].completedBoxDisplay}>
                      <Paper elevation={3} >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box sx={{ padding: "18px 10px", display: "flex", alignItems: "center" }}>
                            <DoneIcon
                              fontSize="small"
                              sx={{ mr: 2, color: "green" }}
                            />
                            <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                              {phraseList[i].phraseText}
                            </Typography>
                          </Box>

                          <div className="recboxBtnBox">
                            <button className="recboxBtn" id={phraseList[i].box_no}
                                onClick={(e) => handleListenClick(e)}
                              > Listen
                            </button>
                            <button className="recboxBtn" id={phraseList[i].box_no}
                                onClick={(e) => handleRetryClick(e)}
                              > Retry
                            </button>
                          </div>
                          <ButtonGroup
                          sx={{display:"none"}}
                            variant="outlined"
                            aria-label="outlined button group"
                          >
                            <Button
                              id={phraseList[i].box_no}
                              onClick={(e) => handleListenClick(e)}
                              sx={{ px: 9, py: 1.3 }}
                            >
                        
                              <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                                Listen
                              </Typography>
                            </Button>

                            <Button
                              id={phraseList[i].box_no}
                              onClick={(e) => handleRetryClick(e)}
                              sx={{ px: 9, py: 1.3 }}
                            > 
                              <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                                Retry
                              </Typography>
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>

                  {/* 2 ================mobile recording box======================== */}
                  <Box sx={{display: { md: "none", xs: "block" }}}>
                    <Box width="100%" mb={5} display={phraseList[i].completedBoxDisplay}>
                      <Paper elevation={3} >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >

                          <Box sx={{ padding: "18px 10px", display: "flex", alignItems: "center" }}>
                            <DoneIcon
                              fontSize="small"
                              sx={{ mr: 2, color: "green" }}
                            />
                            <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                              {phraseList[i].phraseText}
                            </Typography>
                          </Box>

                          <ButtonGroup
                            variant="outlined"
                            aria-label="outlined button group"
                          >
                            <Button
                              id={phraseList[i].box_no}
                              onClick={(e) => handleListenClick(e)}
                              sx={{ px: 9, py: 1.3, width:"50%" }}
                            >
                              
                              <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                                Listen
                              </Typography>
                            </Button>

                            <Button
                              id={phraseList[i].box_no}
                              onClick={(e) => handleRetryClick(e)}
                              sx={{ px: 9, py: 1.3, width:"50%" }}
                            > 
                              <Typography variant="h3" component="p" fontSize={14} fontWeight={600}>
                                Retry
                              </Typography>
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>


                  {/* 3 ================phrase text======================== */}
                  <Box px={1.9} mt={5} display={phraseList[i].phraseBoxDisplay}>
                    <Typography
                      sx={{ color: "#95a5a6" }}
                      variant="h3"
                      component="p"
                      fontSize={14}
                      fontWeight={600}
                    >
                     {phraseList[i].phraseText}
                    </Typography>
                  </Box>
                </Box>
              );
            }

            let sub_container = [];

            if(timerBtnClick !== nextcount){
              for(var j=initialCount; j<nextcount; j++){
                if((thankyouBtnPos === j) && (thankyouBtnPos !==0)){
                  sub_container.push(
                    <BlueButton
                    onClick={() => {
                      if(recordRTC){
                        recordRTC.destroy()
                      }
                      navigate("/" + params.userId + "/thankyou")
                      } }
                    sx={{
                      marginTop:"20px",
                    }}
                    variant="contained"
                  >
                    Thank you
                  </BlueButton>
                  );
                  break
                }
                sub_container.push(container[j]);
              }
            } 

            return sub_container;
          })()}          
        </Box>
      </Box>
    </Box>
  );
}
