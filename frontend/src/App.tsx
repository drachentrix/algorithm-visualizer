import './App.css'
import SideBar from "./components/sidebar/SideBar.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SortComponent from "./components/algorithms/SortComponent.tsx";

function App() {
    return (
        <>
            <div>
                <Router>
                    <div className="contentBody">
                        <SideBar></SideBar>
                        <Routes>
                            <Route path={"algorithm/sorting/:id"} element={<SortComponent/>}/>
                        </Routes>
                    </div>
                </Router>
            </div>
        </>
    )
}

export default App
