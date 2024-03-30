import styles from './Choice.module.css';
import { Role } from './../../types/type';

const Choice = ({ id, role, onRemove, onToggleRole, canRemove }: { id: number, role: Role, onRemove: () => void, onToggleRole: () => void, canRemove: boolean }) => {
    const getImageForRole = (role: Role) => {
        console.log(role)
        switch(role) {
            case Role.MONOPOLIST:
                return "img/monopolista.jpg";
            default:
                return "img/konkurent.jpg";
        }
    };

    const imageSrc = getImageForRole(role);

    return (
        <figure className={styles["choice--figure"]} onClick={onToggleRole}>
            <img src={imageSrc} alt={`Hráč ${id}`} />
            <figcaption>{`Hráč ${id}`}</figcaption>
            {canRemove && (
                <div className={styles["delete__bubble"]} onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}>
                    <img src="img/cross-line.svg"></img>
                </div>
            )}
        </figure>
        
    );
};

export default Choice;
