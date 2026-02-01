import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { lazy, Suspense } from "react";
import styled from "styled-components";
import Navbar from "./components/Navbar";

/* ======================
   STYLED COMPONENTS
====================== */
const Loader = styled.p`
  text-align: center;
  margin-top: 40px;
  color: #666;
`;

/* ======================
   LAZY PAGES
====================== */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Feed = lazy(() => import("./pages/Feed"));
const Chats = lazy(() => import("./pages/Chats"));
const ChatWindow = lazy(() => import("./pages/ChatWindow"));


/* ======================
   PRIVATE ROUTE
====================== */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

/* ======================
   APP CONTENT
====================== */
const AppContent = () => {
  return (
    <>
      <Navbar />

      <Suspense fallback={<Loader>Loading...</Loader>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />

          <Route
            path="/chats"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />

          <Route
            path="/chat/:chatId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

/* ======================
   ROOT APP
====================== */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}


export default App;
