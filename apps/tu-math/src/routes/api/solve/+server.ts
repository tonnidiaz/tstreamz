import OpenAI from "openai";
import { GEMINI_API_KEY, OPEN_API_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const openai = new OpenAI({ apiKey: OPEN_API_API_KEY });

const promptPrefix = "(In the response, write any maths text in latex that can be rendered in mathjax. Answer in simple steps for tutorials Begin with Final answer:) "
const testPrompt = "Factorise: 2x - 6x^2";
const processInput = async () => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { "role": "system", "content": "You are a math tutor who explains concepts clearly in steps and writes any maths text in latex format inside <math-field></math-field> tag." },
            {
                role: "user",
                content: testPrompt,
            },
        ],
    });

    console.log(completion.choices[0].message);
    return completion.choices
};

const askGemini = async (q: string = testPrompt) =>{
    const res = await geminiModel.generateContent(promptPrefix + q)
    return res.response.text()
}
export const POST = async ({request}) => {
    const data = await request.json()
    if (false){
        console.log("\n", data.q)
        return new Response("\\(ax^2 - 2bx + c = 5\\)")

    }
    return json(await askGemini(data.q))
};
