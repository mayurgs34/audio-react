//
//  Node.js v18.18.0 npm 10.2.1
//  File: ScreenThankyou.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's Thank you page.
//

import React, { useEffect } from "react";
import {
  Typography,
  styled,
  Stack,
  Box
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Progressbar_desktop from "./Progressbar_desktop";
import Progressbar_mobile from "./Progressbar_mobile";

export default function ScreenThankyou() {
  /*
    ScreenThankyou
    ~~~~~~~~~~~~~~~~~
    
    This Component displays Thank you message.
  */    
    const navigate = useNavigate();
    const params = useParams();

    // On initial load setting value for local storage  TY_firstLoadDone
    // which is used for refresh logic, whwn refresh navigate to home screen
    useEffect(() => { 
      if (localStorage.getItem('TY_firstLoadDone') === null) {
        // If it's the first load, set the flag in local storage to true and reload the page
        localStorage.setItem('TY_firstLoadDone', 1);
        console.log('This is the initial load');
      } else {
        localStorage.clear()
        console.log('This is a page refresh');
        navigate("/" + params.userId)
      }
    }, [])


  return (
    <Box>
      {/* logo display for mobile view */}
      <Box
        sx={{ display: { md: "none", xs: "block" }  }}
      >
          <Box px={2.5} pt={2.5} maxWidth={1370}>
            <Box>
              <img src="/logo1.png" alt="stryker logo" width="114px" height="34px" />
            </Box>
          </Box>  
      </Box>

      {/* logo display for desktop view */}
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
      
      <Box>
        <Box maxWidth={1370} mt={5} mx={"auto"}>
          <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
            {/* progress bar display desktop view */}
            <Box display={"flex"} justifyContent={"center"} sx={{ display: { md: "block", xs: "none" }}}>
              <Progressbar_desktop bar_val={50}/>
            </Box>

            {/* progress bar display mobile view */}
            <Box display={"flex"} justifyContent={"center"} sx={{mx:"auto", display: { md: "none", xs: "block" }}}>
              <Progressbar_mobile bar_val={50}/>
            </Box>
            
            <Box>
              < Typography textAlign={"center"} variant="body1" component="p" fontSize={24} fontWeight={800} color={'#4CAF50'}>
                  Done!
              </Typography>
            </Box>
          </Box>

          {/* Thank you text display desktop view */}
          <Box sx={{ display: { md: "block", xs: "none" } }}>
            <Typography my={5} textAlign={"center"} variant="body1" component="p" fontSize={38} fontWeight={600}>
              Thank you!
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={22} fontWeight={500}>
            We want to extend our heartfelt gratitude to you for generously submitting your voice samples. 
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={22} fontWeight={500}>
            Your contributions are directly shaping the future of healthcare products, and your willingness to participate <br/>
            is making a significant difference in the lives of healthcare workers who serve tirelessly. 
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={22} fontWeight={500}>
            Thank you for your invaluable support and for being an integral part of this journey towards better healthcare <br/>
            solutions.
            </Typography>
          </Box>

          {/* Thank you text display mobile view */}
          <Box px={2.5} sx={{ display: { md: "none", xs: "block" } }}>
            <Typography my={5} textAlign={"center"} variant="body1" component="p" fontSize={28} fontWeight={600}>
              Thank you!
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={16} fontWeight={500}>
            We want to extend our heartfelt gratitude to you for generously submitting your voice samples. 
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={16} fontWeight={500}>
            Your contributions are directly shaping the future of healthcare products, and your willingness to participate <br/>
            is making a significant difference in the lives of healthcare workers who serve tirelessly. 
            </Typography>
            <Typography my={4} textAlign={"center"} variant="body1" component="p" fontSize={16} fontWeight={500}>
            Thank you for your invaluable support and for being an integral part of this journey towards better healthcare <br/>
            solutions.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
