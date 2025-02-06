import axios from 'axios'
const main = async()=>{
const url = "https://tu-jobs.vercel.app/jobs"
axios.get(url)
.then(response => console.log(response.data))
.catch(error => console.error(error));
}

main()