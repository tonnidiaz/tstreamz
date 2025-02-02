import TuErrorPage from "@repo/ui-next/components/TuErrorPage";

const NotFound = () => {
    return ( <TuErrorPage status={404} msg="Ooops! Page not found."/> );
}
 
export default NotFound;