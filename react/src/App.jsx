import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import MenuBar from "./components/Menubar";

function App() {
    return (
        <div className="bg-purple-500">
            <div>
                <Navbar />
                <MenuBar />
                <br></br>
                {<Outlet />}
            </div>
        </div>
    );
}

export default App;
