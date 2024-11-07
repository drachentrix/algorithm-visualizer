import Header from "./Header.tsx";
import styles from "./Sidebar.module.css"

function SideBar() {
    return (
        //Here will land the selection for the algorithms
        <div>
            <Header headerName={"Sorting algorithms"}
                    algoOptions={[
                        {id: 1, value: "Selection Sort"},
                        {id: 2, value: "Bubble Sort"},
                        {id: 3, value: "Insertion Sort"}
                    ]}/>
            <Header headerName={"Pathfinding algorithms"} algoOptions={[
                {id: 1, value: "Breadth First Search (BFS)"},
            ]}/>
        </div>
    )
}

export default SideBar