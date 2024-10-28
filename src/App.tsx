import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


function App() {
    return (<div className="bg-black">
        <div className="flex flex-col min-h-screen max-w-[800px] px-10 m-auto text-t-primary bg-gray-800">
            <Router>
                <div className="bg-black" id="content" style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </div>
            </Router>
         
        </div>
        </div>
    );
}

export default App;
