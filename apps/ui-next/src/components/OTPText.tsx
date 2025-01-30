const OTPText = ({ email }: { email: string }) => {
    return (
        <p className="text-center fs-12">
            Enter the 4-digit pin sent to{" "}
            <span className="text-primary fw-6">{email}</span>
        </p>
    );
};

export default OTPText;
