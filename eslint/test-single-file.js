const Path = require('path')
const {spawn} = require('child_process')
const filePath = process.argv[2]
const filename = Path.basename(filePath).replace(/(.+?)\..+/, (_, cap) => cap)
const targetTestFilePath = Path.join(
    process.cwd(),
    './dist/tests/rules',
    filename,
)

async function main() {
    await spawn(
        'mocha',
        ['--reporter dot', '--require @babel/register', targetTestFilePath],
        {stdio: 'inherit'},
    )
}

main()
