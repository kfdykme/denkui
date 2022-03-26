
const isWindows = () => {
    return Deno.build.os === "windows"
}

export default {
    isWindows
}