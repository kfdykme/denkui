
let _project:any|undefined = undefined
const PROJECT_CONFIG_PATH = './project_config.json'
const DEFAULT_PROJECT = {
    targetSourcePath:"../bbs-quick/"
}

const get = async () => {
    if (_project == undefined) {
        const path = Deno.cwd() + '/' + PROJECT_CONFIG_PATH
        console.info('Project get', path)
        try {
            
            const content = Deno.readTextFileSync(path)
            _project = JSON.parse(content)
        } catch (err) {
            _project = DEFAULT_PROJECT
            Deno.writeTextFileSync(path, JSON.stringify(_project, null, 2))
        }
    }
    return _project
}

export default {
    get
}