import { TuButton, TuFormGroup, TuInput } from "@mobile/ui-next/components";
const Components = () => {
    return (
        <div className="p-4 flex flex-col gap-4 m-auto" style={{ width: 500 }}>
            {/* <input type="text" placeholder="Enter username..." className="tu-inp" /> */}
            <div className="flex flex-col gap-2 border border-gray-600 rounded-lg p-4">
                <TuFormGroup label="Username">
                    <TuInput placeholder="Enter username..." />
                </TuFormGroup>
                <TuFormGroup label="Email address">
                    <TuInput
                        type="email"
                        placeholder="e.g. johndoe@gmail.com"
                    />
                </TuFormGroup>
                <TuFormGroup label="Password">
                    <TuInput
                        type="password"
                        placeholder="Enter your password"
                    />
                </TuFormGroup>
                <div className="grid grid-cols-2 gap-3">
                    <TuButton variant="default">Sign up</TuButton>
                    <TuButton variant="error">Delete account</TuButton>
                </div>
            </div>
        </div>
    );
};

export default Components;
