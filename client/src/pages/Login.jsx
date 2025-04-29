import { useEffect } from "react";
import { https } from "../helpers/https";
import { useNavigate } from "react-router";

export default function Login() {
  let navigate = useNavigate();

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const { data } = await https.post("/login/google", {
      googleToken: response.credential,
    });
    localStorage.setItem("access_token", data.access_token);
    navigate("/home");
  }

  useEffect(() => {
    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-5 border-0 shadow-lg"
        style={{ width: 450, borderRadius: 15 }}
      >
        <h1 className="fw-bold text-center text-primary mb-5">Login Page</h1>
        <form>
          <div className="mb-4">
            <label className="form-label mb-2">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label mb-2">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-2">
            <button className="btn btn-primary w-100">Login</button>
          </div>
        </form>
        <div id="buttonDiv"></div>
      </div>
    </div>
  );
}
