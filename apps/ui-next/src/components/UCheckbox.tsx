import { useTuState } from "../lib/hooks";
import { TuState } from "../lib/interfaces";
import UFormGroup from "./UFormGroup";

const UCheckbox = ({
    disabled,
    toggle,
    value = useTuState(),
    className,
    ...props
}: {
    disabled?: boolean;
    value?: TuState<boolean>;
    [key: string]: any;
    toggle?: boolean;
}) => {
    return ( <UFormGroup
        className={"text-center flex items-end fs-15 gap-1.5 justify-end mt-1 " +
            className}
        style={{flexDirection: 'row-reverse', width: 'fit-content'}}
        labelClass="!mb-0"
        {...props}
        labelStyle={{lineHeight: '1rem'}}
    >
        <input
            disabled={disabled}
            type="checkbox"
            className={toggle
                ? "toggle"
                : "checkbox checkbox-xs checkbox-primary border-card"}
            checked={value.value}
            onChange={e=> value.value = e.target.checked}
        />
    </UFormGroup> );
}
 
export default UCheckbox;