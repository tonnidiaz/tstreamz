import ytdl from "ytdl-core"

const main = async () =>{
    try {
        console.log(main);
        const url = "https://www.youtube.com/watch?v=MlzEB5AYSjA";
        const hannahLink = "https://www.youtube.com/watch?v=9UlkGuJVfCg&pp=ygUOc3F1YXNoZSB0b25pY3M%3D"
        const y = await ytdl.getInfo(url)
        console.log((y));
    
    } catch (err) {
        console.log("[Eee]", err)
    }
}

main()