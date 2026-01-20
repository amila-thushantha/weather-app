import Dashboard from "./pages/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="authPage">
        <div className="authCard glass">
          <div className="authKicker">WEATHER ANALYTICS</div>
          <h2 className="authTitle">Loading…</h2>
          <p className="authSub">Preparing secure session</p>
          <div className="authSpinner" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
  return (
    <div className="authPage">
      <div className="authCard glass">
        <div className="authKicker">WEATHER ANALYTICS</div>
        <h2 className="authTitle">Weather Comfort Dashboard</h2>
        <p className="authSub">
          Sign in to view ranked cities using the Comfort Index (0–100).
        </p>

        <div className="authBtnGroup">
          {/* LOGIN */}
          <button
            className="authBtn authBtnPrimary"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                  prompt: "login",
                },
              })
            }
          >
            🔐 Continue (Login)
          </button>

          {/* SIGN UP / CREATE ACCOUNT */}
          <button
            className="authBtn authBtnSecondary"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                  screen_hint: "signup",
                },
              })
            }
          >
            ✨ Create account (Sign up)
          </button>
        </div>

        <p className="authHint">
          Auth powered by <b>Auth0</b> • JWT secured API
        </p>
      </div>
    </div>
  );
}


  return (
    <>
      {/* small top right floating logout (optional) */}
      <div className="authTopRight glass">
        <span className="authUser">{user?.name || user?.email}</span>
        <button
          className="authBtn authBtnDanger"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Logout
        </button>
      </div>

      <Dashboard />
    </>
  );
}
