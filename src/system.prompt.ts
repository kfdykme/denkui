
import logger from './log/console.ts'
import LifeCycleController from './core/LifeCycleController.ts'
 
export default {
    showToast: (o:any) => { 
        logger.info("SYSTEM.PROMPT => ", o)
        LifeCycleController.getInstance()
        .prompt(o)
    }
}