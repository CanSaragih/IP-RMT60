import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export function PublicLayout() {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export function PrivateLayout() {
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
