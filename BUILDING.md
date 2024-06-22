# Building

Build for Windows

```console
bun install
$env:RUSTFLAGS="-C target-feature=+crt-static"
bunx tauri build
```

Build for macOS / Linux

```console
bun install
bunx tauri build
```