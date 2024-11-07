import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { RxTriangleRight } from "react-icons/rx";
import React, { useRef, useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import WebSocketService from "../../websocket/WebSocketService.tsx";
import styles from "./RunComponent.module.css";
import { IoReload } from "react-icons/io5";
import { IoIosPause } from "react-icons/io";

interface RunComponentProps<T> {
    id: string;
    items: T;
    setItems: React.Dispatch<React.SetStateAction<T>>;
    applyStep: (item: T, currentStep: number, takenSteps: string[]) => T;
    message: any;
    clearItems?: (items: T) => T
}

function RunComponent<T>({
                             id,
                             items,
                             setItems,
                             applyStep,
                             message,
                         }: RunComponentProps<T>) {
    const [isConnected, setIsConnected] = useState(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [maxSteps, setMaxSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [takenSteps, setTakenSteps] = useState<string[]>([]);
    const [originalList, setOriginalList] = useState<T>(items);
    const currentIsPaused = useRef<boolean>(false);

    const addStep = (item: string) => {
        if (item === "CLEAR;!") {
            setTakenSteps([]);
            setMaxSteps(0)
            setCurrentStep(0)
        } else {
            setTakenSteps((prev) => [...prev, item]);
        }
    };

    const startAlgorithm = () => {
        setCurrentStep(0);
        setOriginalList(items);
        setIsConnected(true);
    };


    const incrementCurrentStep = (value: number) => {
        let newStep = currentStep + value;
        if (0 <= newStep && newStep <= maxSteps) {
            setCurrentStep(newStep);
        }
    };

    const clearItems = () => {
        setOriginalList([] as T);
        setCurrentStep(0);
        setMaxSteps(0);
        setTakenSteps([])
        setItems([] as T);
        clearItems()
    };

    useEffect(() => {
        setItems(applyStep(originalList, currentStep, takenSteps));
    }, [currentStep]);
    const delay = (ms: number | undefined) => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const playAlgo = async () => {
        if (takenSteps.length == 0 || currentStep == maxSteps){
            startAlgorithm() // Working but still no pause
        }

        async function goTroughListRec(step: number) {
            if (step >= maxSteps || currentIsPaused.current) {
                setIsPlaying(false);
                currentIsPaused.current = false
                return;
            }
            await delay(800);
            setCurrentStep(step + 1);
            await goTroughListRec(step + 1);
        }

        if (!isPlaying) {
            setIsPlaying(true);
            await goTroughListRec(currentStep);
        }

    }



    const undoPause= () =>{
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
                <div>{currentStep} : {maxSteps}</div>
                <FaArrowRight
                    onClick={() => incrementCurrentStep(1)}
                    title="Next Step"
                />

                <div className={styles.clearButton}>
                    {isPlaying ?
                        <IoIosPause onClick={undoPause}/> :
                        <RxTriangleRight onClick={playAlgo}
                                         title="Autoplay"
                        />}
                </div>
                <div className={styles.clearButton}>
                    <RiDeleteBin5Line
                        onClick={clearItems}
                        title="Clear items"
                    />
                </div>
                <div className={styles.startButton}>
                    <IoReload
                        onClick={startAlgorithm}
                        title="Reload Steps"
                    />
                </div>
            </div>
            {isConnected && (
                <WebSocketService
                    id={id}
                    addStep={addStep}
                    isConnected={isConnected}
                    onDisconnect={() => setIsConnected(false)}
                    incrementMaxStep={() => {
                        setMaxSteps((prev) => prev + 1)
                    }}
                    messageToSend={message}
                />
            )}
        </>
    );
}

export default RunComponent;
