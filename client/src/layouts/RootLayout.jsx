import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
