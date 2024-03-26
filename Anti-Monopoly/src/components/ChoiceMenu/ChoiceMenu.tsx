import { Link } from "react-router-dom";
import Choice from "../Choice/Choice";
import styles from "../ChoiceMenu/ChoiceMenu.module.css";
const ChoiceMenu = () => {
    console.log("ChoiceMenu")
    return (
        <div className={styles["choice--menu"]}>
            <div className={styles["choice--role"]}>
                <Choice />
                <Choice />
                <Choice />
                <Choice />
            </div>
            <div>
            <input type="radio" id="time-limit" />
            <label htmlFor="time-limit">časový limit</label>
            <input type="radio" id="all-vs-all" />
            <label htmlFor="all-vs-all">Všichni proti všem</label>
            </div>
            <Link to="/playing">Start</Link>
        </div>
    );
};

export default ChoiceMenu;