import axios from 'axios'
const main = async()=>{
    const r = await axios.get("https://www.pnet.co.za/jobs")
    console.log(r.data);
}

main()