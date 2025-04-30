import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PublicPage from "./pages/Public.page";
import DetailDestination from "./pages/DetailDesination";
import { PrivateLayout, PublicLayout } from "./layouts/RootLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/destination/:id" element={<DetailDestination />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
