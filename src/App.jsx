import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
// import useSocket from "./hooks/useSocket";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}