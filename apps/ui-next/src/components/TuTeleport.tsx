import { useEffect, useRef } from "react";

interface IProps {
    to?: string; children?: React.ReactNode
}
const TuTeleport = ({ to = "body", children, ...props }: IProps) => {
    const element = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const targetElement = document.querySelector(to);
        if (targetElement) {
            targetElement.appendChild(element.current);
            element.current.classList.remove("hidden");
        }
        return () => {
            // element.current?.remove();
        };
    });
    return (
        <div ref={element} className="hidden">
            {children}
        </div>
    );
};

export default TuTeleport;
