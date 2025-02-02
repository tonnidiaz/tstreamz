import LinksComponent from "@/components/LinksComponent";
import TMeta from "@repo/ui-next/components/TMeta";

const page = () => {
    return (
        <>
            <TMeta title="Contact us | Tu app" />
            <div className="p-4">
                <LinksComponent/>
            </div>
        </>
    );
};

export default page;
