# SubtitlePop MCP

**Check subtitle timing, convert SRT/WebVTT, shift timestamps and extract transcripts from your MCP client.**

A local, open-source companion from [SubtitlePop](https://subtitlepop.com/). No API key, account, model or paid credits are required. The server processes subtitle **text** over stdio. It does not open paths, fetch URLs, write files or call SubtitlePop's commercial backend.

## Quick start

Requires **Node.js 22+** and an MCP client that supports local stdio servers.

```json
{
  "mcpServers": {
    "subtitlepop": {
      "command": "npx",
      "args": ["-y", "subtitlepop-mcp@0.1.0"]
    }
  }
}
```

This is the common `mcpServers` configuration shape; consult your client's settings for the exact configuration file. Restart or reconnect the client after adding it. On Windows, if your client cannot spawn `npx`, install the package locally and point `command` at `node` and `args` at the absolute installed `src/cli.js` path. The package itself does not need a shell.

```sh
npx -y subtitlepop-mcp@0.1.0 --help
```

The command without flags starts a protocol server, not an interactive prompt. It may look idle when run alone: your MCP client supplies requests on stdin. Do not paste subtitle content into shell arguments.

## Ask your agent

> Inspect this SRT. Explain the timing issues before changing anything. Then return a VTT shifted 1,500 milliseconds later, retaining the original.

Give the agent the subtitle text or an explicitly authorized file it can read with its own file tools. This server does not grant it filesystem access. Transformed text comes back in the tool result; ask your client to save it to a **new** file if desired.

| Tool | Input | Result |
| --- | --- | --- |
| `inspect_subtitles` | `subtitle`, optional `format` and review thresholds | Issues, summary, per-cue metrics, pagination |
| `convert_subtitles` | `subtitle`, `to: "srt"` or `"vtt"` | Plain-text subtitle output and loss warnings |
| `shift_subtitles` | `subtitle`, integer `offsetMs`, optional `negative` and `to` | Shifted text, original indices of clipped/dropped cues |
| `extract_transcript` | `subtitle`, optional `format` | Plain text in cue file order, loss warnings |

### A diagnostic result you can reproduce

The synthetic [example](examples/captions.srt) has three cues. Parsing succeeds, but inspection reports three warnings: an overlap, a long line and a fast-reading caption. Cue 3 has 61 characters in 600 ms, or about 101.7 characters/second. Moving the entire track does not repair the overlap or increase its display time.

```json
{
  "name": "inspect_subtitles",
  "arguments": {
    "subtitle": "1\n00:00:01,000 --> 00:00:03,000\nHello!\n",
    "maxCps": 20,
    "issueLimit": 50,
    "metricLimit": 20
  }
}
```

`format` defaults to `auto`. Issue and metric indices are **zero-based**. Use `issuePage.nextOffset` as `issueOffset`, and `metricPage.nextOffset` as `metricOffset`, to request subsequent pages with the same source and thresholds. Default pages contain 50 issues and 20 metrics; maximums are 200 and 100. Totals describe the complete analyzed input, not just the returned page.

Readability defaults are 20 code points/second, 42 code points/line and 2 lines/cue. They are adjustable heuristics, not language-specific reading models or accessibility certification. Spaces count; line breaks do not. Overlaps may be intentional. Parsing errors can coexist with partial cues; transformations reject input with errors instead of exporting partial content.

### Time shifts and clipping

Positive offsets move captions later, negative offsets earlier. Default `negative: "reject"` refuses a cue that would start before zero. Explicit `negative: "clip"` can shorten a cue or drop it entirely and reports every affected original index. Offset range is ±24 hours. Each call starts from its supplied text: submitting already-shifted output shifts it again.

## Format and privacy limits

- Maximum input: **64 KiB UTF-8, 1,000 cues** per call. Maximum generated text: 128 KiB.
- This is a text-caption subset, not a full WebVTT validator. NOTE/STYLE/REGION/header metadata are omitted with warnings. Conversion strips markup and inline word timestamps; SRT drops VTT positioning and renumbers cue identifiers. Keep originals.
- VTT export requires cues sorted by start time. This MCP does not silently reorder cues. Correct order explicitly before calling it.
- There is no ASS parser, speech transcription, translation, word alignment, media playback or MP4 rendering.
- The server makes no network requests and does not log caption text. Installing dependencies uses npm; your AI client/model may send tool inputs/results to its provider and keep conversation logs. Local MCP processing is **not** a guarantee that the whole AI workflow is offline.
- Treat captions and transcripts as untrusted data. Render text safely; text extraction is not HTML sanitization.

See [format support](https://github.com/j-river/subtitle-timing-kit/blob/main/docs/format-support.md), [privacy and trust boundaries](docs/privacy.md), and the [WebVTT specification](https://www.w3.org/TR/webvtt1/).

## Where SubtitlePop fits

This server is for files you already have. The separate [SubtitlePop subtitle generator](https://subtitlepop.com/subtitle-generator/) turns speech into editable captions; the website supports caption styling and video workflows. Try the [subtitle checker](https://subtitlepop.com/tools/subtitle-checker/) or [SRT-to-VTT tool](https://subtitlepop.com/tools/srt-to-vtt/) when you prefer a browser interface. Commercial workflows have their own pricing and privacy terms and are not invoked by this MCP.

The server wraps the independently published [subtitle-timing-kit](https://github.com/j-river/subtitle-timing-kit), not the private commercial application. A no-install [Timing Lab](https://huggingface.co/spaces/j-river/subtitle-timing-lab) demonstrates that companion library separately.

## Develop and verify

```sh
npm ci --ignore-scripts
npm run check
npm run smoke
npm pack --dry-run
```

Tests use the official MCP client to spawn the actual stdio entry point, negotiate the protocol, list all four tools and exercise conversions, nested overlaps, clipping, invalid/oversized input and instruction-shaped caption text. The server writes only MCP messages to stdout in protocol mode. `--help` and `--version` are separate human-readable CLI modes.

Registry metadata is in `server.json`; its presence does not mean a Registry listing has been published. See [release steps](docs/releasing.md).

## License

MIT. All samples are synthetic. No credentials, customer recordings or production application code are included.
