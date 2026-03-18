import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");

const result = spawnSync("npm", ["run", "build"], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: true
});

if (result.status !== 0) {
    process.exit(result.status || 1);
}

for (const folder of ["dist", "terraform"]) {
    fs.cpSync(
        path.join(packageRoot, folder),
        path.join(process.cwd(), folder), {
        recursive: true,
        force: true,
        dereference: true
    });
}
