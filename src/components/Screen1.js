//
//  Node.js v18.18.0 npm 10.2.1
//  File: Screen1.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application Concent Form.
//

import React, { useEffect } from "react";
import {
  Button,
  Typography,
  styled,
  Box,
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate, useParams } from "react-router-dom";
import data_file from "../assets/files/config.json";
import { useLocation } from "react-router-dom";

export default function Screen1() {
  /*
    Screen1
    ~~~~~~~~~~~~~~~~~
    
    This Component displays the concent form that Requests user for their concent
    and then proceed with application.
  */

  const navigate = useNavigate();
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

  const [campaignText, setcampaignText] = React.useState("");
  const location = useLocation();
  const params = useParams();

  // On initial load Check if campaign is valid else navigate to 404 page
  useEffect(() => {

    let path_list = location.pathname.split("/");
    let camp_val = "";
    for (let i = 0; i < path_list.length; i++) {
      if (data_file.hasOwnProperty(path_list[i])) {
        camp_val = path_list[i];
        setcampaignText(path_list[i]);
      }
    }

    if (camp_val == "") {
      navigate("/404");
      setcampaignText("no_campaign_found");
    }
  }, []);


  // get concent text from json dependng upon campaignText else navigate to 404 page
  let concent_text = "";
  if (campaignText === "") {
    concent_text = "";
  } else {
    concent_text = data_file[campaignText].concent;
    if (concent_text === undefined) {
      navigate("/404");
    }
  }

  // Returns JSX for the concent screen
  return (
    <Box>
      {/*logo display mobile view */}
      <Box
        sx={{ display: { md: "none", xs: "block" }, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)"  }}
        bgcolor="#ffb500"
      >
          <Box p={2.5} pb={5} maxWidth={1370}>
            <Box>
              <img src="/logo1.png" alt="stryker logo" width="114px" height="34px"/>
            </Box>

            <Typography variant="h6" component="p" mt={2.6} fontWeight={700} fontSize={22} lineHeight={1.3}>
              Your voice can be a powerful force <br/> for positive change in <br/>
              healthcare.
            </Typography>
          </Box>  
      </Box>      

      {/*logo display desktop view */}
      <Box
        sx={{ display: { md: "block", xs: "none" }, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)"  }}
        bgcolor="#ffb500"
      >
          <Box p={5} maxWidth={1370}>
            <Box>
              <img src="/logo1.png" alt="stryker logo" width="148px" height="44px" />
            </Box>

            <Typography variant="h6" component="p" mt={2.6} fontWeight={700} fontSize={28} lineHeight={1.3}>
              Your voice can be a powerful force for positive change in
              healthcare.
            </Typography>
          </Box>  
      </Box>

      <Box maxWidth={1370} sx={{ p: { md: 5, xs:2.5 } }}>
        {/* display concent_text based on campaign */}
        <Typography variant="body1" component="p" fontWeight={500} fontSize={16}>
          {concent_text}
        </Typography>

        <Typography mt={{md: 5, xs:2.5}} variant="body1" component="p" fontWeight={500} fontSize={16}>
          This activity will take about{" "}
          <span style={{ color: "#CB9200" }}>10-12 mins</span> to complete
        </Typography>

        {/*button display for desktop view*/}
        <BlueButton
          sx={{ display: { md: "flex", xs: "none" } }}
          variant="contained"
          endIcon={<ArrowRightAltIcon />}
          onClick={() =>
            navigate("/" + params.userId + "/consent")
          }
        >
          Start
        </BlueButton>

        {/*button display for mobile view*/}
        <BlueButton
          sx={{ display: { md: "none", xs: "flex" }, width:"100%" }}
          variant="contained"
          endIcon={<ArrowRightAltIcon />}
          onClick={() =>
            navigate("/" + params.userId + "/consent")
          }
        >
          Start
        </BlueButton>          
      </Box>
    </Box>
  );
}
