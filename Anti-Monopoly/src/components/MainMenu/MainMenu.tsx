import { Link } from 'react-router-dom';
import styles from './MainMenu.module.css';

const MainMenu = () => {
    return (
        <div>
            <h1 className={styles["h1--main--menu"]}>ANTI-MONOPOLY</h1>
            <div className={styles["div--buttons"]}>
                <Link to="/choicemenu" className={styles["a--main--menu"]}>Hrát</Link>
                <Link to="/rules" className={styles["a--main--menu"]}>Pravidla</Link>
            </div>
            <p className={styles["made__by"]}>Vytvořeno @Kostlan</p>
        </div>
    );
};

export default MainMenu;
