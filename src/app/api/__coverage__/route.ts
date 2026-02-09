import fs from "fs";
import path from "path";

const DIR = path.resolve(process.cwd(), ".nyc_output");

export async function POST(req: Request) {
    const json = await req.json();

    fs.mkdirSync(DIR, { recursive: true });

    const file = path.join(DIR, `coverage-${Date.now()}-${Math.random()}.json`);

    fs.writeFileSync(file, JSON.stringify(json));

    return new Response("ok");
}
