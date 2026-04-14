import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomeScreen } from "./screens/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { ProductDetail } from "./screens/ProductDetail";
import { CartScreen } from "./screens/CartScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { MemberCardsScreen } from "./screens/MemberCardsScreen";

const RegisterScreen = React.lazy(() => import("./screens/RegisterScreen").then(m => ({ default: m.RegisterScreen })));
const ForgotPasswordScreen = React.lazy(() => import("./screens/ForgotPasswordScreen").then(m => ({ default: m.ForgotPasswordScreen })));
const ResetPasswordScreen = React.lazy(() => import("./screens/ResetPasswordScreen").then(m => ({ default: m.ResetPasswordScreen })));
const AccountSettingsScreen = React.lazy(() => import("./screens/AccountSettingsScreen").then(m => ({ default: m.AccountSettingsScreen })));

const SuspenseLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#F8F7FF]">
    <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeScreen },
      { path: "menu", Component: MenuScreen },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: CartScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "member-cards", Component: MemberCardsScreen },
      { path: "account-settings", element: <Suspense fallback={<SuspenseLoader />}><AccountSettingsScreen /></Suspense> },
    ],
  },
  { path: "/login", Component: LoginScreen },
  { path: "/register", element: <Suspense fallback={<SuspenseLoader />}><RegisterScreen /></Suspense> },
  { path: "/forgot-password", element: <Suspense fallback={<SuspenseLoader />}><ForgotPasswordScreen /></Suspense> },
  { path: "/reset-password", element: <Suspense fallback={<SuspenseLoader />}><ResetPasswordScreen /></Suspense> },
]);
