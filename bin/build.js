const { spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const packageRoot = path.resolve(__dirname, "..")

for (const folder in ["dist", "terraform"]) {
    fs.cpSync(
        path.join(packageRoot, folder),
        path.join(process.cwd(), folder), {
        recursive: true,
        force: true,
        dereference: true
    })
}


const result = spawnSync("npm", ["run", "build"], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: true
});

if (result.status !== 0) {
    process.exit(result.status || 1);
}