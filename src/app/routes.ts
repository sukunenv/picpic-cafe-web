import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomeScreen } from "./screens/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { ProductDetail } from "./screens/ProductDetail";
import { CartScreen } from "./screens/CartScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { ForgotPasswordScreen } from "./screens/ForgotPasswordScreen";
import { AccountSettingsScreen } from "./screens/AccountSettingsScreen";

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
      { path: "account-settings", Component: AccountSettingsScreen },
    ],
  },
  { path: "/login", Component: LoginScreen },
  { path: "/register", Component: RegisterScreen },
  { path: "/forgot-password", Component: ForgotPasswordScreen },
]);
