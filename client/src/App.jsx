import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PublicPage from "./pages/Public.page";
import DetailDestination from "./pages/DetailDesination";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/destination/:id" element={<DetailDestination />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
