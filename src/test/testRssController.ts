import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts";
import { RssController } from "@/kftodo/rss/RssController.ts";




const rssController = new RssController();

rssController.initResponseFunc((data: any) => {
    console.info('rss controller response:', JSON.stringify(data))
})


let testRssData: AsyncIpcData = {
    id: 'test_id_0',
    isResponse: false,
    data: {
        invokeName: 'addRss',
        data: {
            url: 'https://sspai.com/feed'
        }
    }
}

const res = rssController.tryHandleInvoke(testRssData)

const testFail = (text:string) => {
    throw new Error('test error: ' + text)
}

if (!res) {
    testFail('tryHandleInvoke return false')
}