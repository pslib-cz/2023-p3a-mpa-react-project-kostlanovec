import Choice from "../Choice/Choice";
const ChoiceMenu = () => {
    console.log("ChoiceMenu")
    return (
        <div className="Choice--menu">
            <Choice />
            <Choice />
            <Choice />
            <label htmlFor="time-limit">časový limit</label>
            <input type="radio" id="time-limit" />
            <label htmlFor="all-vs-all">Všichni proti všem</label>
            <input type="radio" id="all-vs-all" />
            <button>Start</button>
        </div>
    );
};

export default ChoiceMenu;