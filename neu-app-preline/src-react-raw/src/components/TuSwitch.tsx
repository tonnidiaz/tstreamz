const TuSwitch = ({value, onChange} : {value?: boolean, onChange?: (val: boolean)=>any}) => {
    return (
        <>
            <input checked={value}
                onChange={({target})=> onChange?.(target.checked)}
                type="checkbox"
                id="hs-basic-usage"
                className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200"
            />
            <label htmlFor="hs-basic-usage" className="sr-only">
                switch
            </label>
        </>
    );
};

export default TuSwitch;
