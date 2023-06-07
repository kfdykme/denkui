
import Path from '@/common/common.path.ts'
import { readableStreamFromReader } from "https://deno.land/std@0.140.0/streams/conversion.ts";

//  Path.homePath() + Path.Dir.Spelator + '.denkui' + Path.Dir.Spelator 
// Start listening on port 8080 of localhost.

let homePath =  '' 
const httpServerCache: any = {}
function getContentType(fileExt: string) {
    switch (fileExt) {
      case 'html':
        return 'text/html';
      case 'css':
        return 'text/css';
      case 'js':
        return 'text/javascript';
      case 'json':
        return 'application/json';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'text/plain';
    }
  }
const startHttpServer = async () => {

    const server = Deno.listen({ port: 10825 });
    console.log("File server running on http://localhost:10825/");

    for await (const conn of server) {
    handleHttp(conn).catch(console.error);
    }

    async function handleHttp(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        // Use the request pathname as filepath
        const url = new URL(requestEvent.request.url);
        console.info(httpServerCache[url.toString()], url.toString())
        // if (httpServerCache[url.toString()] != undefined) {

        //     const response = new Response(httpServerCache[url.toString()]);
        //     await requestEvent.respondWith(response);
        //     return
        // }
        const filepath = decodeURIComponent(url.pathname);
        // console.info('requestEvent.request.url', requestEvent.request.url)
        if (homePath == '') {
            try {
                homePath = requestEvent.request.url.split('home=')[1]
            } catch {
                
            }
        }
        // if (requestEvent.request.url)
        // Try opening the file
        let file;
        const targetPath =  homePath === '' ? Path.homePath() + Path.Dir.Spelator + 'editor' : homePath
        try {
            file = await Deno.open(targetPath + filepath, { read: true });
        } catch {
        // If the file cannot be opened, return a "404 Not Found" response
        const notFoundResponse = new Response("404 Not Found: " + targetPath + filepath, { status: 404 });
        await requestEvent.respondWith(notFoundResponse);
        return;
        }

        const body = readableStreamFromReader(file);

        const fileExt = filepath.split('.').pop() as string;
        const contentType = getContentType(fileExt);
        const response = new Response(body, { headers: new Headers({
            'Content-Type': contentType,
          }),});
        await requestEvent.respondWith(response);
        
    }
    }
}

export default {
    startHttpServer
}