import './App.css'
import SideBar from "./components/sidebar/SideBar.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SortComponent from "./components/algorithms/SortComponent.tsx";
import PathfindingComponent from "./components/algorithms/PathfindingComponent.tsx";

function App() {
    return (
        <>
            <div>
                <Router>
                    <div className="contentBody">
                        <SideBar/>
                        <Routes>
                            <Route path="algorithm/Sortingalgorithms/:id" element={<SortComponent/>} />
                            <Route path="algorithm/Pathfindingalgorithms/:id" element={<PathfindingComponent/>} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
