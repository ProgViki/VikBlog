import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import Inventory from '../../pages/Inventory'
import Orders from '../../pages/Orders'
import Customers from '../../pages/Customers'


export default function AppRoutes() {
  return (
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/customers" element={<Customers />} />
   </Routes>
   </BrowserRouter>
  )
}
