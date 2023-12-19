//
//  Node.js v18.18.0 npm 10.2.1
//  File: RedirectPage.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Redirect to stryker's home page whenever base URL is entered.
//

import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";

export default function RedirectPage() {
    const navigate = useNavigate();

    useEffect(() => {
      // Redirect to Home screen from base URL
      navigate("/" + 'UK')
    }, []);

  return (
    <div></div>
  )
}
