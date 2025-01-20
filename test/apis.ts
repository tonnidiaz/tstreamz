import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://netflix-video-mp4.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': '71e962e760mshe177840eb7630a1p1ce7a7jsncff43c280599',
    'x-rapidapi-host': 'netflix-video-mp4.p.rapidapi.com'
  }
};
const main = async ()=>{
   try {
	const response = await axios.get(options.url, {headers: options.headers});
	console.log(response.data);
} catch (error) {
	console.error(error);
} 
}
main()