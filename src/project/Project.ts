
let _project:any|undefined = undefined
const PROJECT_CONFIG_PATH = './project_config.json'
const DEFAULT_PROJECT = {
    targetSourcePath:"../kfdo/"
}

const get = async () => {
    if (_project == undefined) {
        const path = Deno.cwd() + '/' + PROJECT_CONFIG_PATH
        console.info('Project get', path)
        try {
            const content = new TextDecoder('utf-8').decode(Deno.readFileSync(path))
            _project = JSON.parse(content)
        } catch (err) {
            _project = DEFAULT_PROJECT
            console.info('Project get error', err)
            Deno.writeTextFileSync(path, JSON.stringify(_project, null, 2))
        }
    }
    return _project
}

export default {
    get
}