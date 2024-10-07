import {FaArrowLeftLong, FaArrowRight} from "react-icons/fa6";
import {RxTriangleRight} from "react-icons/rx";
import React, {useState, useEffect} from "react";
import WebSocketService from "../../websocket/WebSocketService.tsx";

function RunComponent(props: {
    id: string,
    algorithmTypeId: string,
    items: number[],
    setUpdatedItems: React.Dispatch<React.SetStateAction<number[]>>
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [maxStep, setMaxSteps] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [takenSteps, setTakenSteps] = useState<String[]>([]);

    const addStep = (item: String) => {
        setTakenSteps((prev) => [...prev, item]);
    }
    const incrementMaxSteps = () => {
        setMaxSteps((prev) => prev + 1);
    }
    const handleDisconnect = () => {
        setIsConnected(false);
    };

    const startAlgorithm = () => {
        setCurrentStep(0)
        setMaxSteps(0)
        props.setUpdatedItems([])
        setIsConnected(true)
    }

    const applyStepsToList = () => {
        let modifiedItems = [...props.items];

        for (let i = 0; i < currentStep; i++) {
            const step = takenSteps[i];
            const [fromIndex, toIndex] = step.split(":").map(Number);

            if (fromIndex >= 0 && fromIndex < modifiedItems.length && toIndex >= 0 && toIndex < modifiedItems.length) {
                const [item] = modifiedItems.splice(fromIndex, 1);
                modifiedItems.splice(toIndex, 0, item);
            }
        }

        return modifiedItems;
    }

    const incrementCurrentStep = (value: number) => {
        let newStep = currentStep + value;
        if (0 <= newStep && newStep <= maxStep) {
            setCurrentStep(newStep)
        }
        return undefined;
    }

    useEffect(() => {
        props.setUpdatedItems(applyStepsToList());
    }, [currentStep]);

    return (
        <>
            <div className={"progressBar"}>
                <FaArrowLeftLong onClick={() => incrementCurrentStep(-1)}/>
                <div>{currentStep} : {maxStep}</div>
                <FaArrowRight onClick={() => incrementCurrentStep(1)}/>
            </div>
            <RxTriangleRight onClick={startAlgorithm}/>
            {isConnected && (
                <WebSocketService id={props.id} algorithmTypeId={props.algorithmTypeId} addStep={addStep}
                                  items={props.items} isConnected={isConnected} onDisconnect={handleDisconnect}
                                  incrementMaxStep={incrementMaxSteps}/>
            )}
        </>
    )
}


export default RunComponent