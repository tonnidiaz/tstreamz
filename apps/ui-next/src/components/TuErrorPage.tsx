import TMeta from "./TMeta";

export default function TuErrorPage({
    status,
    msg,
}: {
    status: number;
    msg: string;
}) {
    return (
        <>
        <TMeta title={`${status}: ${msg}`}/>
        <div className="tu-error-page">
            <div className="error">
                <span className="status">{status}</span>
                <div className="message">
                    <h1>{msg}</h1>
                </div>
            </div>
        </div></>
        
    );
}
