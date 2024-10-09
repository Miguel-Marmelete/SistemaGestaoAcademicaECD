import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import MenuBar from "./components/Menubar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="bg-purple-500">
            <div>
                <Navbar />
                <MenuBar />
                <br></br>
                {<Outlet />}
                <ToastContainer />
            </div>
        </div>
    );
}

export default App;
