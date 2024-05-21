import { Typography } from 'antd'
import React from 'react'
import "../App.css"

function AppFooter() {

  return (
    <div className="AppFooter">
      <Typography.Link href="tel:+2347032375614">+2347032375614</Typography.Link>
      <Typography.Link href="https://www.google.com" target="_blank">Privacy Policy</Typography.Link>
      <Typography.Link href="https://www.google.com" target="_blank">Terms of Use</Typography.Link>
    </div>
  )
  
}

export default AppFooter
