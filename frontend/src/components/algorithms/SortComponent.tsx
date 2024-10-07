import RunComponent from "./RunComponent.tsx";
import React, { useState, useEffect } from "react";
import styles from "./SortComponent.module.css";
import { useParams, useLocation } from "react-router-dom";

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

    const removeItemFromList = (index: number) => {
        setItems(items.filter((_, ind) => index !== ind));
    }

    return (
        <div className={styles.baseGrid}>
            <div className={styles.displayField}>
                {items.map((item, index) => (
                    <div key={index} className={styles.Item} onClick={() => removeItemFromList(index)}>{item}</div>
                ))}
            </div>

            <RunComponent
                id={id!}
                algorithmTypeId={"1"}
                items={items}
                setUpdatedItems={setItems}
            />

            <div className={styles.inputField}>
                <input value={currentValue} type={"number"} onChange={handleChange} />
                <button onClick={handleKeyDown}>Add item</button>
            </div>

            <div className={"Replies"}></div>
        </div>
    );
}

export default SortComponent;
