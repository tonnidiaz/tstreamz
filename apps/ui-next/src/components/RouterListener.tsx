import { useRouter, useParams, usePathname} from "next/navigation";
import { useEffect } from "react";

const RouterListener = ({
    onChange,
}: {
    onChange: (router: Location) => any;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = usePathname();

    const handleChange = () => onChange(location);

    useEffect(() => {
        handleChange()
    }, [pathname, params]); // Make sure to include router in the dependency array

    return <></>
};

export default RouterListener;
