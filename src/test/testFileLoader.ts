/*
 * @Author: kfdykme
 */
import {FileLoader} from '@/core/FileLoader.ts'


let path = 'Common/ForumApi.js'
// let path = '../src/Common/ForumApi.js'

let content = new TextDecoder('utf-8').decode(Deno.readFileSync('../src/' + path))
FileLoader.getInstance().loadContent(content, path)