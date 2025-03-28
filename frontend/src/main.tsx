import './App.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";

import Layout from './components/Layout.tsx';
import Menu from './pages/Menu.tsx'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Menu />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
