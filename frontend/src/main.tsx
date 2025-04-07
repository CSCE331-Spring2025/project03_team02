import './App.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Layout from './components/Layout.tsx';
import Menu from './pages/Menu.tsx';
import Inventory from "./pages/Inventory";
import Employees from './pages/Employees.tsx'
import SalesReport from './pages/SalesReport.tsx';
import ChartPage from './pages/ChartPage';
import Reports from './pages/Reports.tsx'
import SignInPage from './pages/SignIn.tsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Menu />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/employees" element={<Employees />} />
          <Route path='/salesreport' element={<SalesReport />} />
          <Route path='/charts' element={<ChartPage />} />
          <Route path='/reports' element={<Reports />} />
        </Route>
        <Route path='/signin' element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);