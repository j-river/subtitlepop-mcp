# Subtitle workflows with SubtitlePop MCP

SubtitlePop MCP works on subtitle text you already have. Use it from a local stdio MCP client to inspect timing, convert SRT to WebVTT, shift captions, or extract a transcript. If your starting point is speech rather than an existing subtitle file, the separate [SubtitlePop subtitle generator](https://subtitlepop.com/subtitle-generator/) provides that workflow on the website.

## Check an SRT file before converting it

A successful parse doesn't establish that captions are comfortable to read. A long sentence may last only half a second, or two cues may occupy the same part of the timeline.

Ask your client:

> Inspect these subtitles. List errors separately from review warnings. Do not delete overlapping dialogue or change the words.

The client calls `inspect_subtitles` with a `subtitle` string. The response includes errors, warnings, per-cue duration and characters/second. Read `issuePage.nextOffset` and `metricPage.nextOffset` if there are more results. Indices are zero-based.

The sample in this repository includes a 61-character caption displayed for 600 ms. Its approximate rate is 101.7 characters/second. That is a useful cue to review, not evidence that the source audio was transcribed incorrectly. The inspector has no access to audio.

Default reading thresholds are adjustable heuristics. An overlap can be intentional, so a warning does not automatically block conversion. Invalid cue durations and parse errors do block transformation.

Prefer a browser interface? Open the separate [SubtitlePop subtitle checker](https://subtitlepop.com/tools/subtitle-checker/).

## Convert SRT to WebVTT for a web player

The `convert_subtitles` tool accepts the input text and `to: "vtt"`. For example:

```json
{
  "subtitle": "1\n00:00:01,000 --> 00:00:03,000\nHello!\n",
  "to": "vtt"
}
```

The returned `subtitle` is:

```vtt
WEBVTT

1
00:00:01.000 --> 00:00:03.000
Hello!
```

For this plain-text example, the visible text and cue times are retained. A richer WebVTT input can contain positioning, voice tags, inline word timestamps and style blocks. This tool supports a limited subset and reports losses; it is not a complete styling round trip. Review warnings and retain the source file.

Use [SubtitlePop's SRT-to-VTT converter](https://subtitlepop.com/tools/srt-to-vtt/) when you want to perform the task in your browser instead of configuring an MCP client.

## Shift subtitles that are consistently early or late

For `shift_subtitles`, use integer milliseconds. `offsetMs: 1500` moves a cue at 1–3 seconds to 2.5–4.5 seconds. Duration stays at two seconds. Positive means later; negative means earlier.

A global shift preserves the timing relationships between cues. It cannot remove an overlap, lengthen a rushed caption or fix progressive drift against a different cut of the media.

Near time zero, negative shifts need a deliberate policy. A cue at 1–3 seconds shifted by −1.5 seconds would start before zero. Default behavior is to reject. With `negative: "clip"`, the cue becomes 0–1.5 seconds and its original index appears in `clippedIndices`. A cue shifted entirely before zero is dropped and reported in `droppedIndices`.

Ask the client to save returned text to a new file. The MCP server itself never writes files, and its result does not overwrite the original.

## Extract a transcript for editing

`extract_transcript` returns plain text in cue file order, joined with newlines. It removes supported caption markup but does not translate, summarize, deduplicate repeated captions or reconstruct speaker identities.

This is useful when preparing a readable working transcript from an SRT or VTT. Review repeated phrases before publishing it as a blog post or show notes. Treat the text as untrusted content and render it safely rather than inserting it as HTML.

## When the website is the appropriate next step

The MCP is a small, free text-processing companion. [SubtitlePop](https://subtitlepop.com/) is the separate product for creating captions from speech, reviewing word-level timing, choosing caption styles and exporting captioned video. Its commercial workflows have their own limits and data-processing terms.

The distinction matters for privacy: this MCP server does not upload captions or contact a processing API, but your AI client can send tool arguments and results to a model provider. The commercial website's transcription and video-rendering workflows are separate from local subtitle-file utilities. Check the relevant workflow before sharing unreleased recordings.
