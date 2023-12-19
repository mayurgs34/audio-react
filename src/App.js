//  Node.js v18.18.0 npm 10.2.1
//  File: App.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application. 
// 
import * as React from 'react';
import {useState, useEffect} from 'react';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Screen1 from './components/Screen1';
import Consent from './components/Consent';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen404 from './components/Screen404';
import ScreenThankyou from './components/Screenthankyou';
import RedirectPage from './components/redirect_page';
import { createTheme, ThemeProvider } from '@mui/material';
import RecordAudio from './components/records';
import data_file from "./assets/files/config.json";
import { useNavigate } from 'react-router-dom';

/**
 * The App ELement which contains routes for each screens.
 */
export default function App() {
  let [campaign, setcampaign] = useState("");
  const navigate = useNavigate();

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Manrope',
        'Poppins',
        'sans-serif',
      ].join(','),
    },});
  
  useEffect(() => {
    let path_list = location.pathname.split("/");
    let camp_val = "";
    for (let i = 0; i < path_list.length; i++) {
      if (data_file.hasOwnProperty(path_list[i])) {
        camp_val = path_list[i];
      }
    }


  }, []);


  return (
    <>
    
  {/* <RecordAudio/> */}
    <ThemeProvider theme={theme}>
      
          <Routes>
            <Route index element={<RedirectPage />} ></Route>
            <Route path={'/:userId' } element={<Screen1/>} ></Route>
            <Route path={'/:userId' +  '/consent'} element={<Consent/>} ></Route>
            <Route path={'/:userId' +  '/accent'} element={<Screen2/>} ></Route>
            <Route path={'/:userId' +  '/session'}  element={<Screen3/>} ></Route>
            <Route path={'/404'} element={<Screen404/>} ></Route>
            <Route path={'/:userId' +  '/thankyou'} element={<ScreenThankyou/>} ></Route> 
            {/* <Route index element={<Consent/>} ></Route>  */}
          </Routes>
        
    </ThemeProvider>
    
    </>
  );
}
