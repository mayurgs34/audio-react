//
//  Node.js v18.18.0 npm 10.2.1
//  File: Progressbar_desktop.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Display Progressbar component for desktop view.
//

import React, {useEffect} from 'react'

// Progressbar component for desktop view
export default function Progressbar_desktop({ bar_val}) {

    // set value of progressbar whenever bar_val value changes
    useEffect(()=>{
        // console.log(bar_val)
        var image = document.getElementById("progressimg1");
        document.documentElement.style.setProperty("--progress", bar_val*2+"%");

        if(bar_val==50){
            document.documentElement.style.setProperty("--color", "#4CAF50");
        }else{
            document.documentElement.style.setProperty("--color", "#FFB500");
        }
        if(bar_val<10){
            image.src="/progress0.svg"
        }else if(bar_val>=10 && bar_val<20){
            image.src="/progress1.svg"
        }
        else if(bar_val>=20 && bar_val<30){
            image.src="/progress2.svg"
        }
        else if(bar_val>=30 && bar_val<40){
            image.src="/progress3.svg"
        }
        else if(bar_val>=40 && bar_val<50){
            image.src="/progress4.svg"
        }
        else if(bar_val>=50){
            image.src="/progress5.svg"
        }
        else{
            image.src="/progress0.svg"
        }
    },[bar_val]);
    
    // Progressbar component for desktop view
    return (
        <div>
            <img id="progressimg1" src="/progress0.svg" alt="flags" />
            <div className="barWrapper">
                <div className="barValue"></div>
            </div>
        </div>
    )
}
