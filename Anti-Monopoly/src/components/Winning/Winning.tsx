import { Link, useLocation } from "react-router-dom";
import { PlayingPlayer, Role } from "../../types/type";
import { useEffect } from "react";
import styles from './Winning.module.css';

const Winning = () => {
  const location = useLocation();
  const { PlayingPlayer: winner } = location.state as { PlayingPlayer: PlayingPlayer };

  useEffect(() => {
    const audio = new Audio("victory.mp3");
    audio.loop = true;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const getImageForRole = (role: Role) => {
    console.log(role)
    switch(role) {
        case Role.MONOPOLIST:
            return "img/monopolista.jpg";
        default:
            return "img/konkurent.jpg";
    }
};

const imageSrc = getImageForRole(winner.role);

  return (
    <div style={{ textAlign: 'center' }}>
      <img  className={styles["winner"]} src={imageSrc} alt={`Hráč ${winner.id}`} />
      <h1 style={{color: "white"}}>Gratuluji, hráči {winner.id}!</h1>
      <p style={{color: "white"}}>Jsi vítězem!</p>
      <Link to="/">MainMenu</Link>
    </div>
  );
};

export default Winning;
