import styles from './Rules.module.css';
import { Link } from "react-router-dom";

const Rules = () => {

    return (
        <>
            <div className={styles["ScrollWindow"]}>
                <Link to="/" className={styles["Exit"]}><img src="img/cross-line.svg"></img></Link>
                <h1 className={styles["h1-rules"]}>Pravidla</h1>
                <div className={styles["div-rules"]}>
                    <p className={styles["red-rules"]}>Pravidla byla mírně upravená pro počítačovou verzi!</p>
                    <ol>
                        <li>deset</li>
                    </ol>
                </div>
            </div>
        </>
    );
};

export default Rules;