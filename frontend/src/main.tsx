import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";

import Layout from './components/Layout.tsx';
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<App />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
