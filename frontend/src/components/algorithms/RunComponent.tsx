import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { RxTriangleRight } from "react-icons/rx";
import React, { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import WebSocketService from "../../websocket/WebSocketService.tsx";
import styles from "./RunComponent.module.css";

interface RunComponentProps<T> {
    id: string;
    items: T;
    setItems: React.Dispatch<React.SetStateAction<T>>;
    applyStep: (item: T, currentStep: number, takenSteps: string[]) => T;
    message: any;
}

function RunComponent<T>({
                             id,
                             items,
                             setItems,
                             applyStep,
                             message,
                         }: RunComponentProps<T>) {
    const [isConnected, setIsConnected] = useState(false);
    const [maxSteps, setMaxSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [takenSteps, setTakenSteps] = useState<string[]>([]);
    const [originalList, setOriginalList] = useState<T>(items);

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
    };

    useEffect(() => {
        setItems(applyStep(originalList, currentStep, takenSteps));
    }, [currentStep]);

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
