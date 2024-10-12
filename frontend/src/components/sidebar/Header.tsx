import {useState} from "react";
import styles from "./Header.module.css";
import {IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import {useLocation, Link} from "react-router-dom";

function Header(props: { headerName: string; algoOptions: { id: number, value: string }[] }) {
    const [showOptions, setShowOptions] = useState(false);
    const location = useLocation();

    const isActive = (id: number) => {
        return location.pathname === `/algorithm/${props.headerName.replace(" ", "")}/${id}`;
    };

    const listItems = props.algoOptions.map((algoOption) => (
        <li key={algoOption.id}>
            <Link
                to={"/algorithm/" + props.headerName.replace(" ", "") + "/" + algoOption.id}
                className={`${styles.sideBarHeader} ${isActive(algoOption.id) ? styles.isActive : ''}`}>
                {algoOption.value}
            </Link>
        </li>
    ));

    return (
        <div className={showOptions ? styles.selectedHeader : ""}>
            <div className={styles.sideBarHeader} onClick={() => setShowOptions(!showOptions)}>
                {props.headerName}
                {showOptions ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </div>
            <ul hidden={!showOptions}>
                <ul>
                    {listItems}
                </ul>
            </ul>
        </div>
    );
}

export default Header;
