import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wrapper from "./components/ready-use/wrapper";

const Login = lazy(() => import("~/pages/login"));
const Dashboard = lazy(() => import("~/pages/dashboard"));

const Rumah = lazy(() => import("~/pages/rumah/rumah"));
const Penghuni = lazy(() => import("~/pages/penghuni/penghuni"));
const JenisIuran = lazy(() => import("~/pages/jenis-iuran/jenis-iuran"));

// rumab > penghuni
const PenghuniRumah = lazy(() => import("~/pages/rumah/penghuni/penghuni"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>

      <Wrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="rumah">
              <Route path="" element={<Rumah />} />
              <Route path=":id/penghuni" element={<PenghuniRumah />} />
            </Route>
            <Route path="/penghuni" element={<Penghuni />} />
            <Route path="/jenis-iuran" element={<JenisIuran />} />
          </Routes>
        </Suspense>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
