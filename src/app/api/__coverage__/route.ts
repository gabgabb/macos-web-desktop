import fs from "fs";
import path from "path";

const COVERAGE_DIR = path.resolve(process.cwd(), ".nyc_output");

export async function POST(req: Request) {
    const json = await req.json();

    fs.mkdirSync(COVERAGE_DIR, { recursive: true });

    const file = path.join(COVERAGE_DIR, `coverage-${Date.now()}.json`);

    fs.writeFileSync(file, JSON.stringify(json));

    return new Response("ok");
}
