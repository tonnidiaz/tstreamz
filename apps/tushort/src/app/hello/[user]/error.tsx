"use client";

import { useEffect } from "react";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string, response?: any; data?: any; status?: any };
    reset: () => void;
}) => {

    useEffect(()=>{
        console.log(error.response);
        console.log(error.data);
        console.log(error.stack);
    }, [])
    return (
        <div className="tu-error-page">
            <div className="error">
                <span className="status">{error.name}</span>
                <div className="message">
                    <h1>{error.message}</h1>
                </div>
            </div>
        </div>
    );
};

export default Error;
