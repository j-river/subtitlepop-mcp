#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, VERSION } from './server.js';

const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log('subtitlepop-mcp\nUsage: subtitlepop-mcp [--help|--version]\nWithout arguments, starts a local MCP stdio server. No API key needed.\nTools: inspect_subtitles, convert_subtitles, shift_subtitles, extract_transcript\nPass subtitle text through your MCP client; no file paths or URLs are opened.\nWebsite: https://subtitlepop.com/');
} else if (args.length === 1 && args[0] === '--version') {
  console.log(VERSION);
} else if (args.length) {
  console.error('Unknown arguments. Use --help; do not pass subtitle text on the command line.');
  process.exitCode = 2;
} else {
  const server = createServer();
  const stop = async () => { await server.close(); };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  try { await server.connect(new StdioServerTransport()); }
  catch { console.error('SubtitlePop MCP failed to start.'); process.exitCode = 1; }
}
