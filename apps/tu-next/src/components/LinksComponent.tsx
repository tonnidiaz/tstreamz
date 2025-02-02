import TuLink from "@repo/ui-next/components/TuLink";

const LinksComponent = () => {
    return (
        <div className="flex gap-2">
            <TuLink to="/">Home</TuLink>
            <TuLink to="/about">About</TuLink>
            <TuLink to="/contact">Contact</TuLink>
            <TuLink to="/rf">RF</TuLink>
            <TuLink to="/rf#1">RF 1</TuLink>
            <TuLink to="/rf#2">RF 2</TuLink>
            <TuLink to="/rf?page=3">RF 3</TuLink>
            <TuLink to="/rf?page=4">RF 4</TuLink>
            <TuLink to="/" reload>Reload</TuLink>
            <TuLink to="https://google.com">External</TuLink>
        </div>
    );
};

export default LinksComponent;
