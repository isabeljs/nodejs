const fs = require("fs")

const version = require("../package").version
const message = fs.readFileSync("./.git/COMMIT_EDITMSG", "utf8")

if (!message.startsWith(`[${version}] `) || message.includes("  ")) {
  console.error("[POLICY] Wrong commit message format")
  process.exit(1)
}
