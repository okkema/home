#!/usr/bin/env node
import { spawnSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageRoot = path.resolve(__dirname, "..")
const localRoot = process.cwd()

const result = spawnSync("npm", ["run", "build"], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: true
})

if (result.status !== 0) {
    process.exit(result.status || 1)
}

for (const folder of ["dist", "functions", "terraform"]) {
    const targetPath = path.join(localRoot, folder)
    if (folder === "terraform" && fs.existsSync(targetPath)) {
        console.log(`Skipping copy: ${folder} already exists.`)
        continue
    }
    console.log(`Copying folder: ${folder}`)
    fs.cpSync(
        path.join(packageRoot, folder),
        targetPath, {
        recursive: true,
        force: true,
        dereference: true
    })
}

const publicPath = path.join(localRoot, "public")
const distPath = path.join(localRoot, "dist")
if (fs.existsSync(publicPath)) {
    const items = fs.readdirSync(publicPath)
    for (const item of items) {
        const src = path.join(publicPath, item)
        const dest = path.join(distPath, item)
        fs.cpSync(src, dest, { recursive: true, force: true, dereference: true })
    }
}
