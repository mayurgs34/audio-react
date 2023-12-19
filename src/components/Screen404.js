//
//  Node.js v18.18.0 npm 10.2.1
//  File: Screen404.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Display error page.
//

import React, { useEffect } from "react";
import {
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Screen404() {
  /*
    Screen404
    ~~~~~~~~~~~~~~~~~
    
    This Component displays 404 message.
    */

    const navigate = useNavigate();

    useEffect(() => {

      if (localStorage.getItem('404_firstLoadDone') === null) {
        // If it's the first load, set the flag in local storage to true and reload the page
        localStorage.setItem('404_firstLoadDone', 1);
        console.log('This is the initial load');
      } else {
        localStorage.clear()
        console.log('This is a page refresh');
        navigate("/")
      } 

    }, [])

  // Returns JSX for the 404 screen
  return (
    <Box>
      <Box
        sx={{
          display: { md: "block", xs: "none" },
          boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)",
        }}
        bgcolor="#ffb500"
      >
        <Box px={5} py={2.6} maxWidth={1370}>
          <Box>
            <img
              src="/logo1.png"
              alt="stryker logo"
              width="148px"
              height="44px"
            />
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{ display: "flex", justifyContent: "center" }}
        variant="h3"
        component="h2"
        fontSize={300}
      >
        404
      </Typography>

      <Typography
        sx={{ display: "flex", justifyContent: "center" }}
        variant="h3"
        component="h2"
        fontSize={70}
      >
        Page not found!
      </Typography>
    </Box>
  );
}
