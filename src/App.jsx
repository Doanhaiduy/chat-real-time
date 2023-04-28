import "./App.css";
import AppProvider from "./Context/AppProvider";
import AuthProvider from "./Context/AuthProvider";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        <Route Component={Login} path="/login" />
                        <Route Component={ChatRoom} path="/" />
                    </Routes>
                    <AddRoomModal />
                    <InviteMemberModal />
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
