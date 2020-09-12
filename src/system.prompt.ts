
import logger from './log/console.ts'
export default {
    showToast: (o:any) => { 
        logger.info("SYSTEM.PROMPT => ", o)
    }
}