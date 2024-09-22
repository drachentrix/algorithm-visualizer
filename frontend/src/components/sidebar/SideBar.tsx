import Header from "./Header.tsx";

function SideBar(){
    return (
        //Here will land the selection for the algorithms
        <>
            <Header headerName={"Sorting algorithms"} algoOptions={["Selection Sort", "Bubble Sort"]}></Header>
        </>
    )
}

export default SideBar