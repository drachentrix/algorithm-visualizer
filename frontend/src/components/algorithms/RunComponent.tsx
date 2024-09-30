import {FaArrowLeftLong, FaArrowRight} from "react-icons/fa6";
import {RxTriangleRight} from "react-icons/rx";
import React from "react";

let started: boolean = false;
function RunComponent(props: { maxStep: number, currentStep: number, setCurrentStep: React.Dispatch<React.SetStateAction<number>> }){

    const startAlgorithm = () => {
        started = true;
    }

    const incrementCurrentStep = (value: number) => {
        let newStep = props.currentStep + value;
        if (started && 0 < newStep && newStep < props.maxStep){
            props.setCurrentStep(newStep)
        }
        return undefined;
    }

    return (
        <>
            <div className={"progressBar"}>
                <FaArrowLeftLong onClick={incrementCurrentStep(-1)}/>
                <div>{props.currentStep} : {props.maxStep}</div>
                <FaArrowRight onClick={incrementCurrentStep(1)}/>
            </div>
            <RxTriangleRight onClick={startAlgorithm}/>
        </>
    )
}


export default RunComponent