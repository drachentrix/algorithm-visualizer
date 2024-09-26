import RunComponent from "./RunComponent.tsx";
import {useState} from "react";

function SortComponent(){
    const items: number[] = []
    const currentValue = 0
    const [currentStep, setCurrentStep] = useState(0);

    const handleKeyDown = (event: { key: string }) => {
        if (event.key == 'Enter'){
            items.push(currentValue)
        }

    }

    return (
        <>
            <div className={"displayField"}></div>
            <RunComponent currentStep={currentStep} setCurrentStep={setCurrentStep} maxStep={items.length}></RunComponent>
            <div className={"inputField"}>
                <input value={currentValue} type={"number"} onKeyDown={handleKeyDown}/>
            </div>
            <div className={"Replies"}></div>
        </>
    )
}

export default SortComponent