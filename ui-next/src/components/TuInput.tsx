import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";

const TuInput = ({
    className = "",
    leading,
    trailing,
    type,
    ...props
}: InputHTMLAttributes<{}> & {
    trailing?: ReactNode;
    leading?: ReactNode;
}) => {

    const [_type, setType] = useState<"text" | "password">("password")

    const changePassType = ()=>{setType(_type == "password" ? "text" : "password")}
    return (
        <div style={{height: 38}} className="flex items-center gap-2 w-full tu-inp relative">
            {leading && <div className="tu-leading">{leading}</div>}
            <input className={"flex-1"} {...props} type={type == "password" ? _type : type}/>
            {trailing ||
                (type == "password" && (
                    <div className="flex gap-2 items-center">
                        {type == "password" && (
                            <button onClick={changePassType} className="tu-menu-item">
                                <i className={`fi fi-br-eye${_type == "text" ? "-crossed" : ""}`}></i>
                            </button>
                        )}
                        {trailing && <div className="tu-trailing">{trailing}</div>}
                    </div>
                ))}
        </div>
    );
};

export default TuInput;
