import LifeCycleController from '@/core/LifeCycleController.ts';
import runtime from '@/common/common.runtime.ts';
import storage from '@/system.storage.ts' 
import KfTodoController from '@/kftodo/KfTodoController.ts';

// let lc = LifeCycleController.getInstance()

// lc.start()

// handle Deno.args 
let args = runtime.GetArgs()
let isLcOpen = false
let global = {
    port: 8082
}
args.forEach((val: string) => {
    const portPrefix = '--port='
    if (val.startsWith(portPrefix)) {
        let port = val.substring(portPrefix.length)
        storage.set({
            key: 'GLOBAL_PORT',
            value: port
        })
        global.port = Number.parseInt(port)
    }
})


const kf =  new KfTodoController()
 if (!isLcOpen) {
    kf.start()
 }

