const loader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div style={{left: 0, top: 0}} className="w-full fixed z-[1000] h-full bg-base-100 flex items-center justify-center tu-loader">
            {children}
            {children ? children : <div className="loading loading-lg"></div>}
        </div>
    );
};

export default loader;
