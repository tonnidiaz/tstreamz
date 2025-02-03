import UInput, { type IUInputProps } from "./UInput";
import jq from "jquery";
import { TuState } from "../lib/interfaces";
import { useEffect, useRef } from "react";
import { useTuState0 } from "../lib/hooks";

interface IProps extends IUInputProps {
    valid?: TuState<boolean>;
    showValidation?: boolean;
}

const TuPassField = ({
    $value = useTuState0(""),
    valid = useTuState0(false),
    showValidation = true,
    ...props
}: IProps) => {
    let passType = $state<"text" | "password">("password");

    const validClass = "text-white fw-6",
        invalidClass = "text-error-2";
    const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    let validationCont = useRef<HTMLDivElement>(null);
    let parent = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const pwdInp = parent.current.querySelector("input");
        let letter = validationCont.current.querySelector(".val-letter")!;
        let capital = validationCont.current.querySelector(".val-cap")!;
        let number = validationCont.current.querySelector(".val-num")!;
        let length = validationCont.current.querySelector(".val-len")!;

        // pwdInp.onfocus = () => {
        //     jq(".pwd-val").show();
        // };
        // pwdInp.onblur = () => {
        //     jq(".pwd-val").hide();
        // };
        const checkPass = () => {
            let lows = /[a-z]/g;
            if (pwdInp.value.match(lows)) {
                jq(letter).removeClass(invalidClass);
                jq(letter).addClass(validClass);
            } else {
                jq(letter).addClass(invalidClass);
                jq(letter).removeClass(validClass);
            }

            let caps = /[A-Z]/g;
            if (pwdInp.value.match(caps)) {
                jq(capital).removeClass(invalidClass);
                jq(capital).addClass(validClass);
            } else {
                jq(capital).addClass(invalidClass);
                jq(capital).removeClass(validClass);
            }

            let nums = /[0-9]/g;
            if (pwdInp.value.match(nums)) {
                jq(number).removeClass(invalidClass);
                jq(number).addClass(validClass);
            } else {
                jq(number).addClass(invalidClass);
                jq(number).removeClass(validClass);
            }

            if (pwdInp.value.length >= 8) {
                jq(length).removeClass(invalidClass);
                jq(length).addClass(validClass);
            } else {
                jq(length).addClass(invalidClass);
                jq(length).removeClass(validClass);
            }

            const pwdVal: string = pwdInp.value;
            valid.value =
                pwdVal.match(lows) &&
                pwdVal.match(caps) &&
                pwdVal.match(nums) &&
                pwdVal.length >= 8;
            // console.log({valid});
            // if (pwdValid) jq(".pwd-val").hide();
        };
        checkPass();
        pwdInp.onkeyup = checkPass;
    }, []);

    return (
        <div ref={parent}>
            <UInput
                type={passType}
                {...props}
                $value={$value}
                trailing={
                    passType == "password" ? (
                        <span
                            onClick={() => {
                                passType = "text";
                            }}
                            className="btn-none"
                            title="show password"
                        >
                            <i className="fi fi-rr-eye"></i>
                        </span>
                    ) : (
                        <span
                            className="btn-none"
                            onClick={() => {
                                passType = "password";
                            }}
                            title="hide password"
                        >
                            <i className="fi fi-rr-eye-crossed"></i>
                        </span>
                    )
                }
                pattern={passPattern.source}
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            ></UInput>

            <div
                ref={validationCont}
                className={
                    "pwd-val form-group my-2 ml-2 text-center " +
                    ((!showValidation || valid.value) && "hidden")
                }
            >
                <p className="fs-12">
                    Must contain{" "}
                    <span className={"val-letter" + ` fw-5 ${invalidClass}`}>
                        a lowercase
                    </span>
                    ,{" "}
                    <span className={"val-cap" + ` fw-5 ${invalidClass}`}>
                        an uppercase
                    </span>
                    ,{" "}
                    <span className={"val-num" + ` fw-5 ${invalidClass}`}>
                        {" "}
                        a number{" "}
                    </span>
                    , and{" "}
                    <span className={"val-len" + ` fw-5 ${invalidClass}`}>
                        at least 8 characters
                    </span>
                </p>
            </div>
        </div>
    );
};

export default TuPassField;
