import { BrowserRouter, Routes, Route } from "react-router";
import { PrivateLayout, PublicLayout } from "./layouts/RootLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PublicPage from "./pages/Public.page";
import DetailDestination from "./pages/DetailDesination";
import ItineraryPage from "./pages/ItineraryPage";
import TripOverviewPage from "./pages/TripOverviewPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/destination/:id" element={<DetailDestination />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/trips/:tripId/itineraries"
            element={<ItineraryPage />}
          />
          <Route
            path="/trips/:tripId/overview"
            element={<TripOverviewPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
