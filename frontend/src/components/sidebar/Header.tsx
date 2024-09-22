import {useState} from "react";
import styles from "./Header.module.css"
import {IoIosArrowDown, IoIosArrowForward} from "react-icons/io";

function Header(props: { headerName: string; algoOptions: string[] }) {
    const [showOptions, setShowOptions] = useState(false);
    const listItems = props.algoOptions.map(algoOption => <li className={styles.sideBarHeader}>{algoOption}</li>)
    return (
        <>
            <div className={showOptions ? styles.selectedHeader : ""}>
                <div className={styles.sideBarHeader} onClick={() => setShowOptions(!showOptions)}>{props.headerName}
                    {showOptions ? <IoIosArrowDown/> : <IoIosArrowForward/>}</div>
                <ul hidden={!showOptions}>
                    {listItems}
                </ul>
            </div>

        </>
    )
}

export default Header