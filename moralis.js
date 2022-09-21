const Moralis = require('moralis');
const glob = require("glob")
const path = require("path")
const fs = require("fs")

async function addToMoralis({ pathToAdd, token, wrapWithDirectory, includeHidden }) {
    const files = glob.sync(path.join(pathToAdd, `/**/*.*`), { dot: includeHidden, nodir: true });
    const abi = files.map((filePath) => ({
        path: wrapWithDirectory ? filePath : filePath.replace(path.join(pathToAdd, '/').toString(), ''),
        content: fs.readFileSync(filePath, { encoding: 'base64' }),
    }));
    await Moralis.default.start({
        apiKey: token
    });

    const response = await Moralis.default.EvmApi.ipfs.uploadFolder({
        abi,
    });
    const cid = response.result[0].path.match('/ipfs/(.*?)/')[1];
    const url = `https://w3s.link/ipfs/${cid}`
    return { cid, url }
}

module.exports = { addToMoralis }