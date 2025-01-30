import { AnchorHTMLAttributes } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface IProps extends AnchorHTMLAttributes<any> {
    to?: string;
    reload?: boolean;
    noactive?: boolean;
}
const TuLink = ({
    children,
    to,
    href,
    className,
    reload,
    noactive,
    ...props
}: IProps) => {
    const pathname = usePathname();

    const adfreeRoutes = ["/auth", "/me"];
    const _class = `tu-link text-${pathname == (to || href) && !noactive ? "primary" : ""} ${className || ""}`;
    const _href = to || href;
    return reload ||
        adfreeRoutes.find((el) => pathname.includes(el)) != undefined ? (
        <a href={_href} className={_class} {...props}></a>
    ) : (
        <Link href={_href} className={_class} {...props}></Link>
    );
};

export default TuLink;
