
import logger from '@/log/console.ts'
 
let sendToastFunc:Function = console.info

export default {
    init: (f:Function) => {
      sendToastFunc = f  
    },
    error: (o:any) => { 
        logger.info("SYSTEM.TOAST ERROR => ", o)
        logger.info(sendToastFunc)
        sendToastFunc({
            name: 'system.toast',
            data: {
                error: `${o}`
            }
        })
    },
    info: (o:any) => { 
        logger.info("SYSTEM.TOAST INFO => ", o) 
        logger.info(sendToastFunc)
        sendToastFunc({
            name: 'system.toast',
            data: {
                msg: `${o}`
            }
        })
    },
}