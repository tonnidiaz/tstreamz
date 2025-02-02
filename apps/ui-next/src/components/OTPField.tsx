import { onMount } from "svelte";
import {handleErrs} from '@repo/common/src/utils/funcs'
import axios, { type AxiosInstance } from "axios";
import OtpText from "./OTPText";
import UButton from "./UButton";
import UFormGroup from "./UFormGroup";
import UInput from "./UInput";
import { DEV } from "../lib/consts";
import { requestOTP } from "@cmn/utils/funcs3";
import { useEffect } from "react";
import { TuState } from "../lib/interfaces";
import { useTuState } from "../lib/hooks";
interface IProps {
        email: string;
        user: string;
        value: TuState<any>;
        action?: string;
        api: AxiosInstance
    }
const OTPField = ({ email, user, value, action, api }: IProps) => {
   
    const MAX = DEV ? 10 : 60;
    let min = useTuState(MAX);

    function startTimer() {
        min.value = MAX;
        const int = setInterval(() => {
            min.value -= 1;
            if (min.value <= 0) clearInterval(int);
        }, 1000);
    }

    async function _requestOTP(e: any) {
        try {
            if (DEV) console.log({ user, action });
            const r = await requestOTP({ user, action, api });
            startTimer();
        } catch (err) {
            handleErrs(err);
            alert("Failed to request OTP");
        }
    }
    useEffect(() => {
        startTimer();
        return () => {(min.value = MAX)};
    }, []);
    return ( <><OtpText email={email} />
        <UFormGroup>
            <UInput
                minLength={4}
                maxLength={4}
                inputClass="t-c"
                placeholder="****"
                required
                $value={value}
            />
        </UFormGroup>
        <div className={`m-auto ${min.value > 0 ? "disabled" : ""}`}>
            <UButton className="btn-none fs-13" onClick={_requestOTP}>
                <span className="text-primary">Resend OTP</span>
                {min.value > 0 &&
                    <span>{" "}in {min.value}s</span>
                }
            </UButton>
        </div></> );
}
 
export default OTPField;