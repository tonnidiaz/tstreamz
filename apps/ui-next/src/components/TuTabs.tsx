import { HTMLAttributes, useEffect, useRef } from "react";
import { TState } from "../lib/interfaces";
import { useTuState } from "../lib/tu";

interface IProps extends HTMLAttributes<{}> {
    label: any;
    content: any;
    tab?: TState<number>;
}

const TuTabs = ({
    label,
    content,
    className,
    tab = useTuState(0),
    ...props
}: IProps) => {
    const labelsParent = useRef<HTMLDivElement>(null);
    const contentsParent = useRef<HTMLDivElement>(null);

    const getLabels = () =>
        labelsParent.current.querySelectorAll("a.tab-label");
    const getContents = () =>
        contentsParent.current.querySelectorAll(".tab-cont");
    let originalContents = useTuState<NodeListOf<Element>>();

    useEffect(() => {
        const labels = getLabels();
        const conts = getContents();
        conts.forEach((el, i) => {
            (el as any).dataset.tab = i;
        });
        originalContents.value = conts;
        labels.forEach((lbl, i) => {
            lbl.role = "tab";
            lbl.classList.add("tab");
            if (tab.value == i) lbl.classList.add("tab-active");
            lbl.addEventListener("click", () => {
                console.log("click", i);
                tab.value = i;
            });
        });
    }, []);

    useEffect(() => {
        // watch tab
        const labels = getLabels();
        // console.log({tab});
        labels.forEach((lbl, i) => {
            lbl.classList.remove("tab-active");
            if (tab.value == i) lbl.classList.add("tab-active");
        });

        const conts = getContents();
        // Update original contents

        originalContents.value = [...originalContents.value].map((el, i) => {
            const _el = [...conts].find(
                (el) => Number((el as any).dataset.tab) == i
            );
            if (_el) el = _el;
            return el;
        }) as any;

        originalContents.value.forEach((el: any, i) => {
            // console.log(el);
            // el.classList.remove('hidden')
            try {
                contentsParent.current.removeChild(el);
            } catch (err) {}

            if (Number(el.dataset.tab) == tab.value)
                contentsParent.current.appendChild(el);
        });
    }, [getLabels()]);

    return (
        <div className={`w-100p h-100p ${className || ""}`} {...props}>
            <div
                role="tablist"
                className="tabs tabs-bordered tab-labels"
                ref={labelsParent}
            >
                {label}
            </div>
            <div className="tabs-" ref={contentsParent}>
                {content}
            </div>
        </div>
    );
};

export default TuTabs;
