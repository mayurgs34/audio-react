//
//  Node.js v18.18.0 npm 10.2.1
//  File: Screen2.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application Accent list.
//
import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Typography,
  styled,
  Box,
  Modal,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate, useParams } from "react-router-dom";
import data_file from "../assets/files/config.json";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

export default function Screen2() {
  /*
    Screen2
    ~~~~~~~~~~~~~~~~~
    
    This Component displays the accent list as per the campaign
    to user
  */    
  const navigate = useNavigate();
  const [accentDisplay, setaccentDisplay] = useState("none");
  const [accentText, setaccentText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const location = useLocation();
  const [freeze, setfreeze] = useState(false);  
  const params = useParams();

  // Values to check on initial load
  useEffect(() => {
      // clear previous screen load VCXP-18045
      localStorage.removeItem("S3_firstLoadDone")

    // check campaign present in config file
    // if not present navigate to 404 page
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

    // check session id present in local storage
    // if not present navigate to screen1 page    
    const check_session = localStorage.getItem('vct_session_id');
    if(check_session == null){
      navigate("/" + params.userId)
    }

    // On Refresh navigate to screen1 
    if (localStorage.getItem('S2_firstLoadDone') === null) {
      // If it's the first load, set the flag in local storage to true and reload the page
      localStorage.setItem('S2_firstLoadDone', 1);
      // console.log('This is the initial load');
    } else {
      let s2Ref = localStorage.getItem("S2_firstLoadDone")
      localStorage.setItem("S2_firstLoadDone",parseInt(s2Ref) + 1)
      s2Ref = localStorage.getItem("S2_firstLoadDone")
      if(s2Ref == 5){
          localStorage.clear()
          // console.log('This is a page refresh s2');    
          navigate("/" + params.userId )
      }
    }
  }, []);


  // CSS styling for button
  const BlueButton = styled(Button)(({ theme }) => ({
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#ffb500",
    color: "black",
    fontSize: 21,
    marginTop: 40,
    padding: "10px 22px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#F79F1F",
    },
    "&:disabled": {
      backgroundColor: "gray",
      color: "white",
    },
  }));


  // On submit button click get token and phrases from server
  // till then show loader when data is received navigate to screen3 
  const handleSubmitClick = () => {

    // start loader
    setfreeze(true)

    // API for getting JWT token
    let jwt_token_val = ""
    var tokenurl =
      process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
      // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
      localStorage.getItem("vct_session_id") +
      "/auth";
    axios
      .get(tokenurl, {
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
        jwt_token_val = posts.token
        localStorage.setItem("vct_token", posts.token);

        // API for getting 50 phrase from server
        var tokenurl1 =
        process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
        // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
        localStorage.getItem("vct_campaign") +
        "/phrases";
    
        axios
            .get(tokenurl1, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',             
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': true,           
                'Authorization': `Bearer ${posts.token}`
            },
            })
            .then((response) => {
            
              // As soon as phrases are received 
              // stop loader, set local storage and navigate  to screen3
              setfreeze(false)
              const posts = response.data;
              localStorage.setItem("vct_phrase_list", JSON.stringify(posts.phrases));
              navigate("/" + params.userId + "/session");
              window.location.reload()
            })
            .catch(function (error) {
            console.log(error);
            });

      })
      .catch(function (error) {
        console.log(error);
      });

    localStorage.setItem("no_of_phrases", data_file[params.userId].no_of_phrases)
  };

  useEffect(() => {
    // Your code here
  }, [handleSubmitClick]);


  // Enables submit Button when accent is set
  useEffect(() => {
    //Runs on the first render
    if (accentText !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [accentText]);

  // Sets local variable and Show input box if other selected 
  const handleAutocompleteChange = (newValue) => {
    if (newValue !== null) {

      if (newValue.label === "Other") {
        setaccentDisplay("");
        setIsDisabled(true);

        setaccentText("");
      } else {
        setaccentDisplay("none");
        setIsDisabled(false);

        setaccentText(newValue.label);
      }

      // Set local storage with accent value
      localStorage.setItem("vct_accent_value", newValue.label);
    } else {
      setIsDisabled(true);
    }
  };

  return (
    <Box>
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

      {/*Logo for desktop view */}
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

      {/*Logo for mobile view */}
      <Box
        sx={{ display: { md: "none", xs: "block" }  }}
      >
        <Box px={2.5} pt={2.5} maxWidth={1370}>
          <Box>
            <img src="/logo1.png" alt="stryker logo" width="114px" height="34px" />
          </Box>
        </Box>  
      </Box>

      {/*view for desktop view */}
      <Box px={5}  sx={{ display: { md: "block", xs: "none" } }}>
        <Typography mt={5} variant="body1" component="p" fontSize={16} fontWeight={500}>
          Please select an accent with which you best identify.
        </Typography>
      </Box>
      <Box width={400} px={5}  sx={{ display: { md: "block", xs: "none" } }}>
        {/* <Typography mt={5} variant="body1" component="p" fontSize={16} fontWeight={500}>
          Please select an accent with which you best identify.
        </Typography> */}

        <Typography mt={5} variant="h4" component="p" fontSize={16} fontWeight={600}>
        Choose your accent.
        </Typography>

        {/* Show list of accent for respective campaign */}
        <Box mt={1.4} fontSize={16} fontWeight={500}>
          <Autocomplete
            fontSize={16} fontWeight={500}
            id="combo-box-demo"
            options={typeof(data_file[params.userId].accent_list) !== 'undefined' ? data_file[params.userId].accent_list : []}
            onChange={(event, newValue) => {
              handleAutocompleteChange(newValue);
            }}
            renderInput={(params) => (
              <TextField fontSize={16} fontWeight={500}
                {...params}
                label="Select an accent"
                placeholder="Type to search"
              />
            )}
          />
        </Box>

        {/* Display Enter accent when other is selected in accent options*/}
        <Typography
          mt={5}
          sx={{ display: accentDisplay }}
          variant="h4"
          component="p"
          fontSize={16}
          fontWeight={600}
        >
          Enter Accent
        </Typography>

        <Box mt={1.4} >
          <TextField
            sx={{ display: accentDisplay, width: "100%" }}
            onChange={(event) => {
              setaccentText(event.target.value);
              localStorage.setItem("vct_accent_value", event.target.value);
            }}
            id="outlined-basic"
            label="Enter your accent"
            variant="outlined"
          />
        </Box>

        {/* Enable submit button when accents are selected */}
        <BlueButton
          disabled={isDisabled}
          sx={{ width: { md: 170 } }}
          variant="contained"
          endIcon={<DoneIcon />}
          onClick={handleSubmitClick}
        >
          Submit
        </BlueButton>          
      </Box>

      {/*View for mobile view */}
      <Box width="100%" px={2.5}  sx={{ display: { md: "none", xs: "block" } }}>
        <Typography mt={2.5} variant="body1" component="p" fontSize={16} fontWeight={500}>
          Please select an accent with which you best identify.
        </Typography>

        <Typography mt={5} variant="h4" component="p" fontSize={16} fontWeight={600}>
        Choose your accent.
        </Typography>

        {/* Show list of accent for respective campaign */}
        <Box mt={1.4} fontSize={16} fontWeight={500}>
          <Autocomplete
            fontSize={16} fontWeight={500}
            id="combo-box-demo"
            options={typeof(data_file[params.userId].accent_list) !== 'undefined' ? data_file[params.userId].accent_list : []}
            onChange={(event, newValue) => {
              handleAutocompleteChange(newValue);
            }}
            renderInput={(params) => (
              <TextField fontSize={16} fontWeight={500}
                {...params}
                label="Select an accent"
                placeholder="Type to search"
              />
            )}
          />
        </Box>

        {/* Display Enter accent when other is selected in accent options*/}
        <Typography
          mt={5}
          sx={{ display: accentDisplay }}
          variant="h4"
          component="p"
          fontSize={16}
          fontWeight={600}
        >
          Enter Accent
        </Typography>

        <Box mt={1.4} >
          <TextField
            sx={{ display: accentDisplay, width: "100%" }}
            onChange={(event) => {
              setaccentText(event.target.value);
              localStorage.setItem("vct_accent_value", event.target.value);
            }}
            id="outlined-basic"
            label="Enter your accent"
            variant="outlined"
          />
        </Box>

        {/* Enable submit button when accents are selected */}
        <BlueButton
          disabled={isDisabled}
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<DoneIcon />}
          onClick={handleSubmitClick}
        >
          Submit
        </BlueButton>          
      </Box>
    </Box>
  );
}
