import React from "react";
import styles from './Rules.module.css';
import { Link } from "react-router-dom";

const Rules = () => {

    return (
        <>
            <div className={styles["ScrollWindow"]}>
                <Link to="/" className={styles["Exit"]}></Link>
                <h1>Pravidla</h1>
                <ol>
                    <li>deset</li>
                </ol>
            </div>
        </>
    );
};

export default Rules;