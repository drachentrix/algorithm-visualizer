import {useState} from "react";
import styles from "./Header.module.css"
import {IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import {
    useLocation,
    Link
} from "react-router-dom";

function Header(props: { headerName: string; algoOptions: { id: number, value: string }[] }) {
    const [showOptions, setShowOptions] = useState(false);
    const location = useLocation();

    const isActive = (id: number) => {
        return location.pathname === `/algorithm/sorting/${id}`;
    }

    const listItems = props.algoOptions
        .map(algoOption =>
            <li className={isActive(algoOption.id) ? styles.isActive : ''}>
                <Link to={"/algorithm/sorting/" + algoOption.id}
                      className={styles.sideBarHeader}>{algoOption.value}</Link>
            </li>)



    return (
        <>
            <div className={showOptions ? styles.selectedHeader : ""}>
                <div className={styles.sideBarHeader} onClick={() => setShowOptions(!showOptions)}>{props.headerName}
                    {showOptions ? <IoIosArrowDown/> : <IoIosArrowForward/>}</div>
                <ul hidden={!showOptions}>
                        <ul>
                            {listItems}
                        </ul>

                </ul>
            </div>

        </>
    )
}

export default Header