import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wrapper from "./components/ready-use/wrapper";
import ProtectedRoute from "./components/ready-use/protected-route";

const Login = lazy(() => import("~/pages/login"));
const Dashboard = lazy(() => import("~/pages/dashboard"));

const Rumah = lazy(() => import("~/pages/rumah/rumah"));
const Penghuni = lazy(() => import("~/pages/penghuni/penghuni"));
const JenisIuran = lazy(() => import("~/pages/jenis-iuran/jenis-iuran"));
const Pengeluaran = lazy(() => import("~/pages/pengeluaran/pengeluaran"));
const Pemasukan = lazy(() => import("~/pages/pemasukan/pemasukan"));

// rumab > kepemilikan
const Kepemilikan = lazy(() => import("~/pages/rumah/kepemilikan/kepemilikan"));
// rumah > kepemilikan > iuran
const Iuran = lazy(() => import("~/pages/rumah/kepemilikan/iuran/iuran"));

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
            <Route element={<ProtectedRoute redirectPath="/login" />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="rumah">
                <Route path="" element={<Rumah />} />
                <Route path=":id/kepemilikan" element={<Kepemilikan />} />
                <Route
                  path=":id/kepemilikan/:kepemilikanId/iuran"
                  element={<Iuran />}
                />
              </Route>
              <Route path="/penghuni" element={<Penghuni />} />
              <Route path="/jenis-iuran" element={<JenisIuran />} />
              <Route path="/pengeluaran" element={<Pengeluaran />} />
              <Route path="/pemasukan" element={<Pemasukan />} />
            </Route>
          </Routes>
        </Suspense>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
