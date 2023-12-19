//
//  Node.js v18.18.0 npm 10.2.1
//  File: Progressbar_mobile.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Display Progressbar component for mobile view.
//

import React, {useEffect} from 'react'

// Progressbar component for mobile view
export default function Progressbar_mobile({ bar_val}) {

    // set value of progressbar whenever bar_val value changes
    useEffect(()=>{
        // console.log(bar_val)
        var image = document.getElementById("mprogressimg");
        document.documentElement.style.setProperty("--progress", bar_val*2+"%");

        if(bar_val==50){
            document.documentElement.style.setProperty("--color", "#4CAF50");
        }else{
            document.documentElement.style.setProperty("--color", "#FFB500");
        }
        if(bar_val<10){
            image.src="/m_progress0.svg"
        }else if(bar_val>=10 && bar_val<20){
            image.src="/m_progress1.svg"
        }
        else if(bar_val>=20 && bar_val<30){
            image.src="/m_progress2.svg"
        }
        else if(bar_val>=30 && bar_val<40){
            image.src="/m_progress3.svg"
        }
        else if(bar_val>=40 && bar_val<50){
            image.src="/m_progress4.svg"
        }
        else if(bar_val>=50){
            image.src="/m_progress5.svg"
        }
        else{
            image.src="/m_progress0.svg"
        }
    },[bar_val]);
    
    // Progressbar component for mobile view
    return (
        <div>
            <img id="mprogressimg" src="m_progress0.svg" alt="flags" />
            <div className="mbarWrapper">
                <div className="mbarValue"></div>
            </div>
        </div>
    )
}
