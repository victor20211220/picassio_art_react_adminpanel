import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

// receives component and any other props represented by ...rest
export default function ProtectedRoute() {
    const user = AuthService.getCurrentUser();
    return user ? <Outlet /> : <Navigate to="/login" />
}