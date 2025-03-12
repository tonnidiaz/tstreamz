import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useTuState } from "@repo/ui-next/lib/hooks";
import TuButton from "@repo/ui-next-preline/components/TuButton";
import { WindowSetTitle } from "@wailsjs/runtime/runtime";
import TuResizable from "@repo/ui-next-preline/components/Resizable";

const RFPage = () => {
    const appStore = useSelector((s: RootState) => s.app);
    const imgRef = useRef<HTMLImageElement>(null);
    const src = useTuState(""); 
    const oldTitle = useTuState("")

  useEffect(()=>{
    oldTitle.value = appStore.title
  }, [])
    useEffect(() => {
        createImgUrl();
    }, [appStore.port]);

    useEffect(() => {
        if (imgRef.current) {
            const img = imgRef.current;
            img.onload = (e) => {
                openCVStuff(img);
            };
        }
    }, [imgRef.current]);

    async function createImgUrl() {
        try {
            if (!appStore.port) return;
            const url = `http://localhost:${appStore.port}/files?path=%2Fmedia%2Ftonni%2Fwin%2Fsrc%2FMint%2FPictures%2Fstngr-industries-qDWiLMxCKCI-unsplash.jpg`;
            const blob = await (await fetch(url)).blob();
            src.value = URL.createObjectURL(blob);
        } catch (err) {
            console.log("Failed to create img url");
        }
    }
    async function openCVStuff(img: HTMLImageElement) {
        // window.cv.then((cv) => {
        //     let mat = cv.imread(img);
        //     console.log(mat);
        //     cv.imshow("out-canvas", mat);
        // });
    }

    async function changeTitle(){
        try {
            
            WindowSetTitle("title-Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam veritatis et ad tenetur ex. Similique, tenetur! Dolores debitis rerum dicta blanditiis quidem laboriosam nihil. Et praesentium voluptates iste? Perspiciatis, exercitationem.")
        } catch (err) {
            
        }
    }
    return (
        <>
            <div className="w-full flex flex-col gap-3 p-4">
                <div className="p-4 flex gap-4 justify-center">
                    <div className="w-300px">
                        {src.value && <img ref={imgRef} src={src.value} alt="" />}
                    </div>
                    <div className="w-300px">
                        <canvas
                            id="out-canvas"
                            className="w-full bg-neutral-900"
                        ></canvas>
                    </div>
                </div>
                <div className="p-4">
                    <TuResizable/>
                    <TuButton onClick={changeTitle}>Change title</TuButton>
                    <h2 className="fs-18 fw-6">App arguments</h2>
                    <div className="ml-2">
                        {appStore.args.length ? <ol className="">
                            {appStore.args.map((el, i) => (
                                <li key={`arg-${i}`} className="tu-menu-item">
                                    {el}
                                </li>
                            ))}
                        </ol> : <p>No args this time</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RFPage;
