import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { VscDiffAdded } from "react-icons/vsc";
import { FaShuffle } from "react-icons/fa6";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { useParams, useLocation } from "react-router-dom";
import RunComponent from "./RunComponent";
import descriptionData from "./descriptions.json";
import styles from "./SortComponent.module.css";

function SortComponent() {
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [items, setItems] = useState<number[]>([]);
    const [previousItems, setPreviousItems] = useState<number[]>([]);
    const [swappedIndices, setSwappedIndices] = useState<{ swapped: number[]; displaced: number[] }>({ swapped: [], displaced: [] });
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        setItems([]);
    }, [location]);

    // Update swapped and displaced items whenever items change
    useEffect(() => {
        const { swapped, displaced } = findSwaps(previousItems, items);
        setSwappedIndices({ swapped, displaced });
        setPreviousItems(items); // Update previous items to the current state
    }, [items]);

    const handleKeyDown = () => {
        setItems(prevItems => [...prevItems, currentValue]);
        setCurrentValue(0);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(Number(event.target.value));
    };

    const shuffleRandomList = () => {
        const shuffledItems = [...items];
        for (let i = shuffledItems.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledItems[i], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[i]];
        }
        setItems(shuffledItems);
    };

    const generateAndAddToList = () => {
        setItems(prevItems => [...prevItems, Math.floor(Math.random() * (500 - 1 + 1))]);
    };

    const removeItemFromList = (index: number) => {
        setItems(items.filter((_, ind) => index !== ind));
    };

    const handleEnter = (pressed: { key: string; }) => {
        if (pressed.key === "Enter") {
            handleKeyDown();
        }
    };

    const data = items.map((item, index) => ({
        index: `${index + 1}`,
        value: item,
    }));

    const applyStepsToList = (originalList: number[], currentStep: number, takenSteps: string[]) => {
        let modifiedItems = [...originalList];
        if (currentStep === 0) {
            return originalList;
        }
        for (let i = 0; i < currentStep; i++) {
            const step = takenSteps[i];
            const numbers = step.split(";");
            for (let j = 0; j < numbers.length; j++) {
                const [fromIndex, toIndex] = numbers[j].split(":").map(Number);
                const temp = modifiedItems[fromIndex];
                modifiedItems[fromIndex] = modifiedItems[toIndex];
                modifiedItems[toIndex] = temp;
            }
        }
        return modifiedItems;
    };

    const findSwaps = (previous, now) => {
        const swapped = [];
        const displaced = [];

        const maxLength = Math.max(previous.length, now.length);

        for (let i = 0; i < maxLength; i++) {
            if (previous[i] !== now[i]) {
                // Check if previous value moved to a new position
                if (previous.includes(now[i]) && !swapped.includes(i)) {
                    swapped.push(i);
                }
                // Check if value in previous was displaced by swap
                if (now.includes(previous[i]) && !displaced.includes(i)) {
                    displaced.push(i);
                }
            }
        }

        return { swapped, displaced };
    };

    const description = descriptionData[id as keyof typeof descriptionData] || "No description available for this algorithm.";

    return (
        <div className={styles.baseGrid}>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={450}>
                    <BarChart data={data} margin={{ top: 20, right: 50, left: 50, bottom: 5 }}>
                        <XAxis
                            dataKey="index"
                            label={{ value: "Position", position: "insideBottom", offset: -5, fill: "#000", fontSize: 20 }}
                            stroke="#000"
                            tick={{ fill: "#000", fontSize: 14 }}
                        />
                        <YAxis
                            label={{ value: "Values", angle: -90, position: "insideLeft", fill: "#000", fontSize: 20 }}
                            stroke="#000"
                            tick={{ fill: "#000", fontSize: 14 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#333",
                                color: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px"
                            }}
                            itemStyle={{ color: "#fff" }}
                            cursor={{ fill: 'rgba(75, 192, 192, 0.2)' }}
                        />
                        <Bar dataKey="value">
                            {data.map((entry, index) => {
                                let fillColor = "rgba(75, 192, 192, 0.8)"; // Default color
                                if (swappedIndices.swapped.includes(index)) {
                                    fillColor = "rgba(54, 162, 235, 0.8)"; // Swapped color
                                } else if (swappedIndices.displaced.includes(index)) {
                                    fillColor = "rgba(255, 99, 132, 0.8)"; // Displaced color
                                }
                                return (
                                    <Cell key={`cell-${index}`} fill={fillColor} />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.itemBoxes}>
                {items.length > 0 && (
                    <div className={styles.itemList}>
                        <h4>Items List (click to remove):</h4>
                        <div className={styles.itemBoxContainer}>
                            {items.map((item, index) => (
                                <div key={index} className={styles.itemBox} onClick={() => removeItemFromList(index)}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.rightPanel}>
                <RunComponent<number[]> id={id!} items={items} setItems={setItems} message={{ items, algorithmId: id, type: "sorting" }} applyStep={applyStepsToList} />

                <div className={styles.inputSection}>
                    <input value={currentValue} type="number" onKeyDown={handleEnter} onChange={handleChange} placeholder="Enter a value" />
                    <VscDiffAdded onClick={handleKeyDown} title={"Add item"} className={styles.addButton} />
                    <GiPerspectiveDiceSixFacesRandom onClick={generateAndAddToList} title={"Generate random number"} className={styles.randomButton} />
                    <FaShuffle onClick={shuffleRandomList} title={"Shuffle list"} className={styles.shuffleButton} />
                </div>

                <div className={styles.descriptionSection}>
                    <h3>Description</h3>
                    <p>{description}</p>
                </div>

                {swappedIndices.swapped.length > 0 && (
                    <div className={styles.differenceSection}>
                        <h4>Changed Items:</h4>
                        <ul>
                            {swappedIndices.swapped.map((index) => (
                                <li key={index}>
                                    Swapped Index {index}: Previous - {previousItems[index] ?? "N/A"}, Now - {items[index] ?? "N/A"}
                                </li>
                            ))}
                            {swappedIndices.displaced.map((index) => (
                                <li key={index}>
                                    Displaced Index {index}: Previous - {previousItems[index] ?? "N/A"}, Now - {items[index] ?? "N/A"}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SortComponent;
