# Release procedure

1. Run `npm ci --ignore-scripts`, `npm run check`, `npm run smoke` and `npm audit --omit=dev`.
2. Inspect `npm pack --dry-run --json`; only the documented public allowlist should ship. Review source, metadata, examples and git history for secrets or personal paths.
3. Build a tarball with `npm pack` and install it into a fresh directory. Run `subtitlepop-mcp --help` and the protocol smoke check against the installed `src/cli.js`.
4. Commit reviewed files to the public `j-river/subtitlepop-mcp` repository. Tag a release only for the reviewed version.
5. Publish to the official npm registry. Complete any npm browser/2FA confirmation personally; never paste passwords, codes or tokens into chat. Verify the public version and a fresh install before describing npm publication as complete.
6. Publish `server.json` with the official MCP Registry publisher after authenticating the `io.github.j-river` namespace. Package `mcpName` must match the Registry name. Follow current official instructions at https://github.com/modelcontextprotocol/registry/tree/main/docs/modelcontextprotocol-io . Do not treat metadata preparation as completed registration.

The client configuration pins a specific package version for repeatability. Update README, package version, runtime version, server.json and changelog together in a new release.
