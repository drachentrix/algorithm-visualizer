import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { RxTriangleRight } from "react-icons/rx";
import React, { useRef, useState, useEffect } from "react";
import { RiDeleteBin5Line, RiSpeedFill, RiSpeedLine } from "react-icons/ri";
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
    clearItems?: (items: T) => T;
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
    const [speedMultiplier, setSpeedMultiplier] = useState(1); // State for speed toggle
    const currentIsPaused = useRef<boolean>(false);

    const addStep = (item: string) => {
        if (item === "CLEAR;!") {
            setTakenSteps([]);
            setMaxSteps(0);
            setCurrentStep(0);
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
        setTakenSteps([]);
        setItems([] as T);
    };

    useEffect(() => {
        setItems(applyStep(originalList, currentStep, takenSteps));
    }, [currentStep]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const playAlgo = async () => {
        if (takenSteps.length === 0 || currentStep === maxSteps) {
            startAlgorithm();
        }

        async function goThroughList(step: number) {
            if (step >= maxSteps || currentIsPaused.current) {
                setIsPlaying(false);
                currentIsPaused.current = false;
                return;
            }
            await delay(1500 / speedMultiplier); // Adjust delay based on speed multiplier
            setCurrentStep(step + 1);
            await goThroughList(step + 1);
        }

        if (!isPlaying) {
            setIsPlaying(true);
            await goThroughList(currentStep);
        }
    };

    const undoPause = () => {
        setIsPlaying(false);
        currentIsPaused.current = true;
    };

    // Toggle 2x speed
    const toggleSpeed = () => {
        setSpeedMultiplier(speedMultiplier === 1 ? 2 : 1);
    };

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
                    {isPlaying ? (
                        <IoIosPause onClick={undoPause} />
                    ) : (
                        <RxTriangleRight onClick={playAlgo} title="Autoplay" />
                    )}
                </div>
                <div className={styles.clearButton}>
                    <RiDeleteBin5Line
                        onClick={clearItems}
                        title="Clear items"
                    />
                </div>
                <div className={styles.startButton}>
                    <IoReload onClick={startAlgorithm} title="Reload Steps" />
                </div>

                {/* Speed Toggle Button */}
                <div onClick={toggleSpeed} className={styles.speedButton} title={speedMultiplier === 1 ? "Switch to 2x Speed" : "Switch to 1x Speed"}>
                    {speedMultiplier === 1 ? <RiSpeedLine /> : <RiSpeedFill />}
                </div>
            </div>
            {isConnected && (
                <WebSocketService
                    id={id}
                    addStep={addStep}
                    isConnected={isConnected}
                    onDisconnect={() => setIsConnected(false)}
                    incrementMaxStep={() => {
                        setMaxSteps((prev) => prev + 1);
                    }}
                    messageToSend={message}
                />
            )}
        </>
    );
}

export default RunComponent;
