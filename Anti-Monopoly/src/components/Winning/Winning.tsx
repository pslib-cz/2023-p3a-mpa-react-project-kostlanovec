import { Link, useLocation } from "react-router-dom";
import { PlayingPlayer } from "../../types/type";

const Winning = () => {
  const location = useLocation();
  const { PlayingPlayer: winner } = location.state as { PlayingPlayer: PlayingPlayer };

  return (
    <div style={{ textAlign: 'center' }}>
        <h1>Gratuluji, hráči {winner.id}!</h1>
        <p>Jsi vítězem!</p>
        <Link to="/">MainMenu</Link>
    </div>
  );
};

export default Winning;
