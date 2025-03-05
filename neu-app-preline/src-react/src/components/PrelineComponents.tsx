import { TuButton, TuFormGroup, TuInput } from "@mobile/ui-next/components";
import TuDivider from "@mobile/ui-next/components/TuDivider";
import TuDropdown from "@mobile/ui-next/components/TuDropdown";
import TuSelect from "@mobile/ui-next/components/TuSelect";


const PrelineComponents = () => {
    return (
        <div className="p-4 flex flex-col gap-4 m-auto" style={{ width: 500 }}>
            <h1 className="text-lg">#Preline components</h1>
            <div className="mt-4"></div>
           <TuButton>Click me</TuButton>
            <Inputs />
            <TuSelect onChange={({target})=> console.log((target as any).value)}>
                <option value="tonni">Tonni Diaz</option>
                <option value="squash">SquashE Tonics</option>
            </TuSelect>
            <div className="flex gap-2">
                <TuDropdown trigger={<button>D1</button>}><>
                    <button className="tu-menu-item">D1 item 1</button>
                    <button className="tu-menu-item">D1 item 2</button>
                    <button className="tu-menu-item">D1 item 3</button>
                    <TuDivider/>
                    <button className="tu-menu-item">D1 item 4</button>
                    <button className="tu-menu-item">D1 item 5</button>
                </></TuDropdown>
                <TuDropdown trigger={<button>D2</button>}><>
                    <button className="tu-menu-item">D2 item 1</button>
                    <button className="tu-menu-item">D2 item 2</button>
                    <button className="tu-menu-item">D2 item 3</button>
                    <TuDivider/>
                    <button className="tu-menu-item">D2 item 4</button>
                    <button className="tu-menu-item">D2 item 5</button>
                </></TuDropdown>
                <TuDropdown trigger={<button>D3</button>}><>
                    <button className="tu-menu-item">D3 item 1</button>
                    <button className="tu-menu-item">D3 item 2</button>
                    <button className="tu-menu-item">D3 item 3</button>
                    <TuDivider/>
                    <button className="tu-menu-item">D3 item 4</button>
                    <TuDropdown isSubmenu={true} className="w-full" trigger={<button className="tu-menu-item">D3 more</button>}>
                        <button className="tu-menu-item">D3 sub-item</button>
                        <button className="tu-menu-item">D3 sub-item 2</button>
                    </TuDropdown>
                    
                </></TuDropdown>
            </div>
        </div>
    );
};

export default PrelineComponents;

const Inputs = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-3">
                <TuFormGroup label="Username">
                    <TuInput placeholder="Enter username..." trailing={<span><i className="fi fi-br-eye"></i></span>}/>
                </TuFormGroup>
                
            </div>
        </div>
    );
};
