import { HTMLAttributes } from "react";
import { useTuState } from "../lib/tu";
import { TState } from "../lib/interfaces";

interface IProps extends HTMLAttributes<any>{page: TState<number>; total: number; onPrev?: ()=>any; onNext?: ()=> any}

const TuPaginator = ({page = useTuState(1), onNext, onPrev, total, className, ...props}: IProps) => {
    return ( <div className={"mx-auto mt-4 w-100p flex justify-center " + className || ''} {...props}>
        <div className="join shadow-lg bg-base-200 z-[51]">
            <button
                onClick={async()=>{
                    if (onPrev) 
                        return await onPrev();
                    page.value -= 1
                }}
                disabled={page.value == 1}
                className="join-item btn border-1 border-card bg-base-200">«</button
            >
            <button className="join-item btn border-1 border-card bg-base-200"
                >Page <span className="text-white">{page.value}</span> of
                <span className="text-white">{total}</span></button
            >
            <button
                onClick={async()=>{
                    if (onNext)
                        return await onNext();
                    page.value += 1
                }}
                disabled={page.value == total}
                className="join-item btn border-1 border-card">»</button
            >
        </div>
    </div> );
}
 
export default TuPaginator;