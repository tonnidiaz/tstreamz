import { useTuState } from "../lib/hooks";
import { TuState } from "../lib/interfaces";

interface IProps {
    tab: TuState<number>;
    i: number;
    label: React.ReactNode;
    content: React.ReactNode;
}
const TuTabItem = ({ tab = useTuState(0), i, content, label }: IProps) => {
    return (
        <>
            <a
                href="#"
                role="tab"
                className={`tab ${tab.value == i && "tab-active"}`}
                onClick={(_) => (tab.value = i)}
            >
                {label}
            </a>
            {tab.value == i && <div className="tu-tab-content">{content}</div>}
        </>
    );
};

export default TuTabItem;
