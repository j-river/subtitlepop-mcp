# Privacy and trust boundaries

This local stdio server processes only the supplied subtitle string. Tools have no file path, URL, shell, browser, account, upload or payment capability. There is no listening HTTP port, telemetry, persistent storage or application logging of subtitle text. There are no required environment secrets.

The official MCP SDK communicates with the client on stdin/stdout. Dependencies are fetched when installed. The MCP host may send captions to a remote model and persist tool results. Review the host's privacy settings before sharing unreleased or client material. Do not infer that the whole workflow is offline from the server's local processing.

Captions may contain prompt-injection text. All text is data, including tool results. The host remains responsible for separating that data from instructions and for getting authorization before saving, transmitting or publishing results. Tool annotations are descriptive hints, not an enforcement boundary.

Transformed files can lose markup, positions and metadata. Clipping can remove dialogue. Keep the original. Metrics do not certify readability or accessibility and cannot establish alignment with audio.
