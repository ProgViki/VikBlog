import React from "react";
import PageContent from "./components/PageContent";
import SideMenu from "./components/SideMenu";
import AppHeader from "./components/AppHeader";
// import { Space } from "antd";
import AppFooter from "./components/AppFooter";
import "./App.css";
// import AppRoutes from "./components/AppRouter";


function App() {


  return (
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
      <SideMenu></SideMenu>
      <PageContent></PageContent>
      {/* <AppRoutes></AppRoutes> */}
      </div>
      <AppFooter />
    </div>
  )
}
export default App
