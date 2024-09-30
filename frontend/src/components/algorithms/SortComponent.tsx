import RunComponent from "./RunComponent.tsx";
import React, {useState, useEffect} from "react";
import styles from "./SortComponent.module.css"
import {useParams, useLocation} from "react-router-dom"

function SortComponent(){
    const [items, setItems] = useState<number[]>([]);
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState(0);
    const {id} = useParams();
    const location = useLocation();

    useEffect(() => {
        setItems([]);
    }, [location]);

    const handleKeyDown = () => {
        setItems(prevItems => [...prevItems, currentValue]);
        setCurrentValue(0)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(Number(event.target.value));
    };
    return (
        <div className={styles.baseGrid}>
            <div className={styles.displayField}>
                {items.map((item) => (<div className={styles.Item}>{item}</div>))}
            </div>
            <RunComponent currentStep={currentStep} setCurrentStep={setCurrentStep} maxStep={items.length}></RunComponent>
            <div className={styles.inputField}>
                <input value={currentValue} type={"number"} onChange={handleChange}/>
                <button onClick={handleKeyDown}>Add item</button>
            </div>
            <div className={"Replies"}></div>
        </div>
    )
}

export default SortComponent