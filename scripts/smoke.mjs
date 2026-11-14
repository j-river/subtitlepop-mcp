import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
const entry=process.argv[2] ?? fileURLToPath(new URL('../src/cli.js',import.meta.url));
const client=new Client({name:'subtitlepop-install-smoke',version:'1.0.0'});
try {
 await client.connect(new StdioClientTransport({command:process.execPath,args:[entry]}));
 const {tools}=await client.listTools();
 const result=await client.callTool({name:'convert_subtitles',arguments:{subtitle:'1\n00:00:01,000 --> 00:00:03,000\nHello from SubtitlePop.\n',to:'vtt'}});
 if(result.isError || !result.structuredContent?.subtitle.startsWith('WEBVTT') || tools.length!==4) throw new Error('Smoke check failed');
 console.log(JSON.stringify({tools:tools.map(t=>t.name),result:result.structuredContent},null,2));
} finally {await client.close();}
