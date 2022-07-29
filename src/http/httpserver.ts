
import Path from '@/common/common.path.ts'

//  Path.homePath() + Path.Dir.Spelator + '.denkui' + Path.Dir.Spelator 
// Start listening on port 8080 of localhost.

let homePath =  '' 
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
        const filepath = decodeURIComponent(url.pathname);
        console.info('requestEvent.request.url', requestEvent.request.url)
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

        // Build a readable stream so the file doesn't have to be fully loaded into
        // memory while we send it
        const readableStream = file.readable;

        // Build and send the response
        const response = new Response(readableStream);
        await requestEvent.respondWith(response);
    }
    }
}

export default {
    startHttpServer
}