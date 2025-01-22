import OpenAI from "openai";
import { GEMINI_API_KEY, OPEN_API_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const CONFIG = {
    instructions:
        "You are a math tutor who explains concepts clearly in simple steps like on an exam memorandum and writes any maths text in latex format so it can be rendered using mathjax. You always begin with 'Final answer:' in your responses.",
    prefix: "(In the response, write any maths text in latex that can be rendered in mathjax. Answer in simple steps for tutorials Begin with Final answer:) ",
};
const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: CONFIG.instructions,
});

const openai = new OpenAI({ apiKey: OPEN_API_API_KEY });

const testPrompt = "Factorise: 2x - 6x^2";

const processInput = async (q: string = testPrompt) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: CONFIG.instructions },
            {
                role: "user",
                content: q,
            },
        ],
    });

    return completion.choices[0].message.content;
};

const askGemini = async (q: string = testPrompt) => {
    const res = await geminiModel.generateContent(CONFIG.prefix + q);
    return res.response.text();
};
export const POST = async ({ request }) => {
    const data = await request.json();
    if (false) {
        console.log("\n", data.q);
        return new Response("\\(ax^2 - 2bx + c = 5\\)");
    }
    return json(await askGemini(data.q));
};
export const prerender = false;
