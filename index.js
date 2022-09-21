const core = require('@actions/core')
const { addToMoralis } = require('./moralis')
const { addToWeb3, pickName } = require('./web3')

async function run() {
  try {
    const name = pickName({
      repo: process.env.GITHUB_REPOSITORY,
      run: process.env.GITHUB_RUN_NUMBER,
      sha: process.env.GITHUB_SHA
    })
    const pathToAdd = core.getInput('path_to_add')
    const token = core.getInput('web3_token')
    const service = core.getInput('service') || 'web3.storage'
    const wrapWithDirectory = core.getBooleanInput('wrap_with_directory')
    const includeHidden = core.getInput('include_hidden')
    let response
    if (service === 'web3.storage') {
      const endpoint = new URL(core.getInput('web3_api'))
      core.info(`Adding ${pathToAdd} to ${endpoint.origin}`)
      response = await addToWeb3({ endpoint, token, name, pathToAdd, wrapWithDirectory, includeHidden })
    } else {
      core.info(`Adding ${pathToAdd}`)
      response = await addToMoralis({ pathToAdd, token, wrapWithDirectory, includeHidden })
    }
    const { cid, url } = response
    core.info(url)
    core.setOutput('cid', cid)
    core.setOutput('url', url)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
