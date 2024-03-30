import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Choice from "../Choice/Choice";
import styles from "../ChoiceMenu/ChoiceMenu.module.css";
import { SettingsContext } from "../../providers/SettingsProvider";

const ChoiceMenu = () => {
    const [state, dispatch] = useContext(SettingsContext);
    const { players } = state;

    const addPlayer = () => {
        dispatch({ type: "ADD_PLAYER" });
    };

    const removePlayer = (id: number) => {
        console.log("smazání hráče")
        dispatch({ type: "REMOVE_PLAYER", payload: id });
    };

    const toggleRole = (id: number) => {
        dispatch({ type: "TOGGLE_ROLE", payload: id });
    };


    return (
        <div className={styles["choice--menu"]}>
            <div className={styles["choice--role"]}>
                {players.map((player, index) => (
                    <Choice 
                        key={player.id} 
                        id={player.id} 
                        role={player.role} 
                        onRemove={() => removePlayer(player.id)} 
                        onToggleRole={() => toggleRole(player.id)}
                        canRemove={index === players.length - 1 && players.length > 2}
                    />
                ))}
                {players.length < 6 && (
                    <figure>
                        <div className={styles["add--figure"]} onClick={addPlayer}>
                            <img src="/img/plus.svg" />
                        </div>
                    </figure>
                )}
            </div> 
            <div className={styles["div--link"]}>
                <Link className={styles["a--playing"]} to="/playing">Start</Link>
            </div>
        </div>
    );
};

export default ChoiceMenu;
