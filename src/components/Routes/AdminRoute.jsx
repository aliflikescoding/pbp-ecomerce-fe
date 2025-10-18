import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { verifyAdmin } from "../../api";

const AdminRoute = () => {
  const [state, setState] = React.useState({ loading: true, ok: false });
  const location = useLocation();

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Must be served withCredentials cookie: admin_session
        const res = await verifyAdmin();
        if (!alive) return;
        // accept any shape you return on /admin/me; assume {status:'success'} or has admin info
        const ok =
          (res?.status && String(res.status).toLowerCase() === "success") ||
          !!res?.id ||
          !!res?.email ||
          !!res?.is_admin;
        setState({ loading: false, ok });
      } catch (e) {
        setState({ loading: false, ok: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span
          className="loading loading-spinner loading-lg"
          aria-label="Loading"
        />
      </div>
    );
  }

  // Not admin → kick to admin login, preserve where they tried to go
  if (!state.ok) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />; // ✅ allow nested admin routes
};

export default AdminRoute;
