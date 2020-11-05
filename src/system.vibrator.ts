
import logger from './log/console.ts'
 
export default {
    show: (o:any) => { 
        logger.info("SYSTEM.NOTIFICATION => ", o) 
    }
}