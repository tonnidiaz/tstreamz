import { HTMLAttributes } from "react";

const TuTabConts = ({ children }: HTMLAttributes<any>) => {
    return (
        <div role="tablist" className="tabs tabs-bordered tab-labels">
            {children}
        </div>
    );
};

export default TuTabConts;
