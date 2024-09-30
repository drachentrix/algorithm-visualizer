import Header from "./Header.tsx";

function SideBar(){
    return (
        //Here will land the selection for the algorithms
        <>
            <Header headerName={"Sorting algorithms"} algoOptions={[{id: 1, value: "Selection Sort"}, {id:2, value: "Bubble Sort"}]}></Header>
        </>
    )
}

export default SideBar