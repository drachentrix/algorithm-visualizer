import React, { useState, useEffect } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { useParams, useLocation } from "react-router-dom";
import RunComponent from "./RunComponent";
import descriptionData from "./descriptions.json";
import styles from "./SortComponent.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function SortComponent() {
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [items, setItems] = useState<number[]>([]);
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        setItems([]);
    }, [location]);

    const handleKeyDown = () => {
        setItems(prevItems => [...prevItems, currentValue]);
        setCurrentValue(0);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(Number(event.target.value));
    };

    const generateAndAddToList = () => {
        setItems(prevItems => [...prevItems, Math.floor(Math.random() * (1000 - 1 + 1))]);
    }

    const removeItemFromList = (index: number) => {
        setItems(items.filter((_, ind) => index !== ind));
    };

    const data = {
        labels: items.map((_, index) => index),
        datasets: [
            {
                label: `Items for ID ${id}`,
                data: items,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(0,0,0)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Index of Items",
                },
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Values",
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: { raw: any }) {
                        return `Value: ${tooltipItem.raw}`;
                    },
                },
            },
            title: {
                display: true,
                text: `Position: ${id}`,
            },
        },
    };

    const description = descriptionData[id as keyof typeof descriptionData] || "No description available for this algorithm.";

    return (
        <div className={styles.baseGrid}>
            <div className={styles.chartContainer}>
                <Bar data={data} options={options} className={styles.chartCanvas} />
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
                <RunComponent id={id!} algorithmTypeId={"1"} items={items} setItems={setItems} />

                <div className={styles.inputSection}>
                    <input value={currentValue} type="number" onChange={handleChange} placeholder="Enter a value"/>
                    <button onClick={handleKeyDown}>Add item</button>
                    <GiPerspectiveDiceSixFacesRandom onClick={generateAndAddToList} title={"Generate random number"} className={styles.randomButton}/>
                </div>

                <div className={styles.descriptionSection}>
                    <h3>Description</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default SortComponent;
