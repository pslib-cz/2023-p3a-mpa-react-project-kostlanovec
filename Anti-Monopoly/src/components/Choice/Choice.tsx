import React from "react";
import styles from './Choice.module.css';

const Choice = () => {

    return (
        <figure className={styles["choice--figure"]}>
            <img src="img/konkurent.jpg"></img>
            <p>Hráč 1</p>
            <div className={styles["delete__bubble"]}>

            </div>
        </figure>
    );
};

export default Choice;