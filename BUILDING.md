# Building

Build for Windows

```console
bun install
$env:RUSTFLAGS="-C target-feature=+crt-static"
bunx tauri build
```