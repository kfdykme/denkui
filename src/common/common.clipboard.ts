import clipboard from 'https://deno.land/x/clipboard/mod.ts';

// await clipboard.writeText('some text');

const text = await clipboard.readText();

console.log(text); // true