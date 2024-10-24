import {FaArrowLeftLong, FaArrowRight} from "react-icons/fa6";
import {RxTriangleRight} from "react-icons/rx";
import React, {useEffect, useState} from "react";
import {RiDeleteBin5Line} from "react-icons/ri";
import WebSocketService from "../../websocket/WebSocketService.tsx";
import styles from "./RunComponent.module.css";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

function RunComponent(props: {
    id: string,
    algorithmTypeId: string,
    items: number[],
    setItems: React.Dispatch<React.SetStateAction<number[]>>,
    message: any
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [maxStep, setMaxSteps] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [takenSteps, setTakenSteps] = useState<String[]>([]);
    const [originalList, setOriginalList] = useState<number[]>([])

    let playing = false

    const addStep = (item: String) => {
        if (item == "CLEAR;!") {
            setTakenSteps([])
        } else {
            setTakenSteps((prev) => [...prev, item]);
        }
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
        setOriginalList(props.items)
        setIsConnected(true)
    }

    const applyStepsToList = () => {
        let modifiedItems = [...originalList];

        if (currentStep === 0) {
            return originalList;
        }
        for (let i = 0; i < currentStep; i++) {
            const step = takenSteps[i];
            const numbers = step.split(";");
            for (let j = 0; j < numbers.length; j++) {
                const [fromIndex, toIndex] = numbers[j].split(":").map(Number)
                const temp = modifiedItems[fromIndex];
                modifiedItems[fromIndex] = modifiedItems[toIndex];
                modifiedItems[toIndex] = temp;
            }
        }
        return modifiedItems;
    };


    const incrementCurrentStep = (value: number) => {
        let newStep = currentStep + value;
        if (0 <= newStep && newStep <= maxStep) {
            setCurrentStep(newStep)
        }
        return undefined;
    }

    const clearItems = () => {
        setOriginalList([]);
        props.setItems([])
    }

    useEffect(() => {
        props.setItems(applyStepsToList());
    }, [currentStep]);

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const playAlgo = () => {

        async function goTroughList() {
                await delay(1000);
                console.log("+1")
                incrementCurrentStep(1)
                goTroughListRec(0)
            return undefined
        }
        async function goTroughListRec(number) {
            if (number >=10){
                playing = false
                return undefined
            }
            await delay(1000);
            console.log("+1")
            await incrementCurrentStep(1)
            await goTroughListRec(number+1)
            return undefined
        }


        if (!playing) {
            playing = true
            goTroughList()
        }
    }


    return (
        <>
            <div className={styles.progressBar}>
                <FaArrowLeftLong
                    onClick={() => incrementCurrentStep(-1)}
                    title="Previous Step"
                />
                <div>{currentStep} : {maxStep}</div>
                <FaArrowRight
                    onClick={() => incrementCurrentStep(1)}
                    title="Next Step"
                />
                <div className={styles.startButton}>
                    <RxTriangleRight
                        onClick={startAlgorithm}
                        title="Start Algorithm"
                    />
                </div>
                <div className={styles.clearButton}>
                    <RiDeleteBin5Line
                        onClick={clearItems}
                        title="Clear items"
                    />
                </div>

                <div className={styles.clearButton}>
                    <RxTriangleRight
                        onClick={playAlgo}
                        title="Play the full Algo"
                    />
                </div>
            </div>
            {isConnected && (
                <WebSocketService
                    id={props.id}
                    addStep={addStep}
                    isConnected={isConnected}
                    onDisconnect={handleDisconnect}
                    incrementMaxStep={incrementMaxSteps}
                    messageToSend={props.message}
                />
            )}
        </>
    )
}

export default RunComponent;
