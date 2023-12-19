//
//  Node.js v18.18.0 npm 10.2.1
//  File: Consent.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application Accent list.
//
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  styled,
  Stack,
  Box,
  List,
  ListItem,
  Modal,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import data_file from "../assets/files/config.json";
import axios from "axios";
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { v4 as uuidv4 } from "uuid";
import CircularProgress from '@mui/material/CircularProgress';
import isEmail from 'validator/lib/isEmail';

export default function Consent() {
  /*
    Consent
    ~~~~~~~~~~~~~~~~~
    
    This Component displays the Consent as per the campaign to user
  */    
  const navigate = useNavigate();
  const [nameText, setnameText] = useState("");
  const [emailText, setemailText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true); 
  const params = useParams();
  const [freeze, setfreeze] = useState(false);  
  const [MSopen, setMSopen] = useState(false);  
  const [IsValidEmail, setIsValidEmail] = useState(false);  
  const [dirty, setDirty] = useState(false);

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


  const BlueButton = styled(Button)(({ theme }) => ({
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#ffb500",
    color: "black",
    fontSize: 21,
    marginTop: 20,
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

  // Values to check on initial load
  useEffect(() => {

    // check campaign present in config file
    // if not present navigate to 404 page
    let camp_val = "";

    if (data_file.hasOwnProperty(params.userId)) {
      camp_val = params.userId;
    }

    if (camp_val == "") {
      navigate("/404");
    }
  }, [])  

  // When email and name is entered set localstorage session id, campaign, current date and time
  useEffect(() => {

    // check email is valid or not
    if(isEmail(emailText)) {
        setIsValidEmail(true);  
        
        if ((emailText !== "") && (nameText !== "")){
          setIsDisabled(false)
        } else {
          setIsDisabled(true)
        }
    
        // Assign session id to user
        try {
          localStorage.setItem("vct_session_id", uuidv4());
          localStorage.setItem("vct_campaign", params.userId);
          localStorage.setItem("vct_curr_date", new Date().toLocaleDateString())
          localStorage.setItem("vct_curr_time", new Date().toLocaleTimeString())
    
        } catch (err) {
          console.error("An error occurred:", err);
        }
        

    } else {
      setIsValidEmail(false);              
    }    

  }, [emailText,nameText]);

  //Submit button click
  const handleSubmitClick = () => {

    // start loader
    setfreeze(true)
    const data = {
      name_text: nameText,
      email_text: emailText,
    }

    // API for getting JWT token
    let ms_token_val = ""
    let ms_token_val_title = ""
    
    var tokenurl =
      process.env.REACT_APP_API_IP + "/api/v1/campaign/" +
      // "https://stryker-audio-collection-api.tools.np.vocera.io/api/v1/campaign/" +
      localStorage.getItem("vct_session_id") +
      "/tenant";
    axios
      .post(tokenurl, 
        data,
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

        // As soon as MS token ID received 
        // extract token and set local storage
        const posts = response.data;
        ms_token_val = posts.id_val
        ms_token_val_title = posts.title_val
        localStorage.setItem("vct_ms_token", posts.id_val);
        localStorage.setItem("vct_ms_token_title", posts.title_val);

        // As soon as MS token is set
        // stop loader, navigate  to accent
        setfreeze(false)
        navigate("/" + params.userId + "/accent");
        window.location.reload()    
      })
      .catch(function (error) {
        console.log(error);
        setfreeze(false)
        setMSopen(true)
      });
  
  };


  return (
    <Box>

      {/* modal when MS token fails */}
      <Modal
        open={MSopen}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...ms_style, width: 400 }}>
          <h2 id="parent-modal-title">Error message</h2>

          <Box my={1}>
            <p id="parent-modal-description">
              Error while getting token.
            </p>
          </Box>

          <Button   
            onClick={() => {
              setMSopen(false)
              navigate("/" + params.userId);
            }} 
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

      <Box maxWidth={1370} sx={{ p: { md: 5, xs:2.5 } }}>
        <Typography color="#303030" variant="body1" component="p" fontWeight={700} fontSize={22}>
        Global Consent to Process Personal Data
        </Typography>

        <Typography color="#CB9200" mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        Consent to Data Processing
        </Typography>

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        By providing my e-mail address below and submitting this form, I, hereby grant Stryker Corporation, its parents, subsidiaries, affiliates, and assigns and its affiliates <br/> ("Stryker") the right to process the following categories of my Personal Information
        </Typography>

        <Box sx={{ pt: { md: 2.5, xs:2.5 } }}>
          <List sx={{pl:"10px"}}>
                <ListItem sx={{p:"0px"}}>
                  <CircleIcon sx={{fontSize:"7px"}}/>
                  <Typography ml={2} variant="body1" component="p" fontWeight={500} fontSize={16}>
                  Contact Information (Name, Email).
                  </Typography>
                </ListItem>
                <ListItem sx={{p:"0px"}}>
                    <CircleIcon sx={{fontSize:"7px"}}/>
                  <Typography ml={2} variant="body1" component="p" fontWeight={500} fontSize={16}>
                  Audio recordings of my voice.
                  </Typography>
                </ListItem>                  
          </List>
        </Box>

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        I grant Stryker the right to process my Personal Information for the sole purpose of Research and Development of Stryker's Products and Services.
        </Typography>

        <Typography color="#CB9200" mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        Additional Considerations
        </Typography>

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        I am aware that the processing of Personal Information will continue for the duration of the purpose(s) for which it is being gathered has been completed, or until I withdraw my consent, which I have the right to do at any time.
        </Typography>

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        I understand I may have rights regarding the processing of my Personal Information (such as withdrawal of consent, access, rectification, restriction and erasure).
        </Typography>     

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        I understand I can contact Stryker in case I have any questions about these rights via the following link : <br/> <a style={{textDecoration:"none"}} href="https://www.stryker.com/ie/en/legal/privacy/consents.html"  target="_blank"> <span style={{ color: "#31ADE6" }}>https://www.stryker.com/ie/en/legal/privacy/consents.html</span> </a>
        </Typography>     

        <Typography mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        Follow this link to read our Privacy Statement: : <br/>  <a style={{textDecoration:"none"}} href="https://www.stryker.com/content/stryker/gb/en/legal/global-policy-statement.html"  target="_blank"> <span style={{ color: "#31ADE6" }}>https://www.stryker.com/content/stryker/gb/en/legal/global-policy-statement.html</span> </a> 
        </Typography> 
        
        <Typography color="#CB9200" mt={{md: 2.5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
        Signature
        </Typography>

        {/* desktop view */}
        <Box mt={{md: 2.5, xs:2.5}} sx={{ display: { md: "block", xs: "none" } }}>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography
                  variant="h4"
                  component="p"
                  fontSize={16}
                  fontWeight={600}
                >
                  Name
                </Typography>

                <Box mt={1.4} >
                  <TextField
                    sx={{width: "320px" }}
                    onChange={(event) => {
                      setnameText(event.target.value);
                    }}
                    id="outlined-basic"
                    label="Enter Name"
                    variant="outlined"
                  />
                </Box>       
            </Box>

            <Box>
              <Typography
                  variant="h4"
                  component="p"
                  fontSize={16}
                  fontWeight={600}
                >
                  Email Address
                </Typography>

                <Box mt={1.4} >
                  <TextField
                    error={dirty && IsValidEmail === false}                                        
                    onBlur={() => setDirty(true)}
                    sx={{width: "320px" }}
                    onChange={(event) => {
                      setemailText(event.target.value);
                    }}
                    id="outlined-basic"
                    label="Enter email id"
                    variant="outlined"
                  />
                </Box>       
            </Box>
          </Stack>

          <BlueButton
            disabled={isDisabled}
            sx={{ width: { md: 170 } }}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSubmitClick}
          >
            Submit
          </BlueButton> 
        </Box> 


          {/* desktop view */}
          <Box mt={{md: 2.5, xs:2.5}} sx={{ display: { md: "none", xs: "block" } }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={16}
                    fontWeight={600}
                  >
                    Name
                  </Typography>

                  <Box mt={1.4} >
                    <TextField
                      sx={{width: "100%" }}
                      onChange={(event) => {
                        setnameText(event.target.value);
                      }}
                      id="outlined-basic"
                      label="Enter Name"
                      variant="outlined"
                    />
                  </Box>       
              </Box>

              <Box>
                <Typography
                    variant="h4"
                    component="p"
                    fontSize={16}
                    fontWeight={600}
                  >
                    Email address
                  </Typography>

                  <Box mt={1.4} >
                    <TextField
                      sx={{width: "100%" }}
                      onChange={(event) => {
                        setemailText(event.target.value);
                      }}
                      id="outlined-basic"
                      label="Enter email id"
                      variant="outlined"
                    />
                  </Box>       
              </Box>
            </Stack>

            <Box mt={2} >
              <BlueButton
                disabled={isDisabled}
                sx={{ width: "100%" }}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleSubmitClick}
              >
                Submit
              </BlueButton>
            </Box>
          </Box> 
      </Box>
    </Box>
  );
}
