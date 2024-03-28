import Board from "./Board";
import WindowsStats from "./WindowStats";
import styles from './Playing.module.css';

const Playing = () => {

    return (
        <>
        <div className={styles["playing--layout"]}>
        <Board />
        <WindowsStats />
        </div>
        </>
    );
};

export default Playing;