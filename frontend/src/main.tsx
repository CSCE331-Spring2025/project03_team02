import './App.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";

import Layout from './components/Layout.tsx';
import Menu from './pages/Menu.tsx'
import SalesReport from './pages/SalesReport.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Menu />} />
        <Route path='/salesreport' element={<SalesReport />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
