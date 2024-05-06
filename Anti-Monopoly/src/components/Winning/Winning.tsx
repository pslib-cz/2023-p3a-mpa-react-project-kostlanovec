import { Link, useLocation } from "react-router-dom";
import { PlayingPlayer } from "../../types/type";
import { useEffect } from "react";

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

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Gratuluji, hráči {winner.id}!</h1>
      <p>Jsi vítězem!</p>
      <Link to="/">MainMenu</Link>
    </div>
  );
};

export default Winning;
