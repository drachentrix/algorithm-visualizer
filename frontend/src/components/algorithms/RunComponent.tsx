import {FaArrowLeftLong, FaArrowRight} from "react-icons/fa6";
import {RxTriangleRight} from "react-icons/rx";
import {IoIosPause} from "react-icons/io";
import React, {useEffect, useRef, useState} from "react";
import {RiDeleteBin5Line} from "react-icons/ri";
import WebSocketService from "../../websocket/WebSocketService.tsx";
import styles from "./RunComponent.module.css";
import {Simulate} from "react-dom/test-utils";
import {isPatternOrGradient} from "chart.js/helpers";


function RunComponent(props: {
    id: string,
    algorithmTypeId: string,
    items: number[],
    setItems: React.Dispatch<React.SetStateAction<number[]>>,
    message: any,
    reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [maxStep, setMaxSteps] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [takenSteps, setTakenSteps] = useState<String[]>([]);
    const [originalList, setOriginalList] = useState<number[]>([])

    const currentIsPaused = useRef<boolean>(false);

    useEffect(() => {
        props.setItems(applyStepsToList());
    }, [currentStep]);

    useEffect(() => {
        if (props.reset) {
            setIsConnected(false)
            setIsPlaying(false)
            setMaxSteps(0)
            setCurrentStep(0)
            setTakenSteps([])
            setOriginalList([])
            props.setReset(false)
        }
    }, [props.reset]);
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
        if (0 <= newStep && newStep <= maxStep && newStep != currentStep) {
            setCurrentStep(newStep)
        }
        return undefined;
    }

    const clearItems = () => {
        setOriginalList([]);
        props.setItems([])
    }

    const delay = (ms: number | undefined) => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const playAlgo = async () => {
        if (takenSteps.length == 0 || currentStep == maxStep){
            startAlgorithm() // Working but still no pause
        }

        async function goTroughListRec(step: number) {
            if (step >= maxStep || currentIsPaused.current) {
                setIsPlaying(false);
                currentIsPaused.current = false
                return;
            }
            await delay(800);
            console.log(step + "  " + currentIsPaused.current)
            setCurrentStep(step + 1);
            await goTroughListRec(step + 1);
        }

        if (!isPlaying) {
            setIsPlaying(true);
            await goTroughListRec(currentStep);
        }

    }



    const undoPause= () =>{
        console.log("PAUSED") //Not working dont know why
        setIsPlaying(false)
        currentIsPaused.current = true
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


                    {isPlaying ?
                        <IoIosPause onClick={undoPause}/> :
                        <RxTriangleRight onClick={playAlgo}
                        title="Play the full Steps"
                    />}
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
