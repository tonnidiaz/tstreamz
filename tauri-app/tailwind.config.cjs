/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
import {twConfig} from '@repo/ui/src/tailwind.config'
export default twConfig(__dirname, 'next')
