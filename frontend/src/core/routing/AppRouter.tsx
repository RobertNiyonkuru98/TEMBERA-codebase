import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./config/publicRoutes";
import { userRoutes } from "./config/userRoutes";
import { adminRoutes } from "./config/adminRoutes";
import { companyRoutes } from "./config/companyRoutes";

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* User Routes */}
      {userRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Admin Routes */}
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Company Routes */}
      {companyRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
