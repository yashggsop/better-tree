# @ruskydev/better-tree

A fast, customizable directory tree viewer for the terminal.


## Installation

You can run it directly with `npx` (no install needed):

```bash
npx @ruskydev/better-tree --help
````

Or install globally:

```bash
npm install -g @ruskydev/better-tree
better-tree --help
```

## Usage

```bash
better-tree [directory] [options]
```

### Options

```
--ignore <patterns...>     Ignore matching files/folders (supports *, **)
--depth <n>                Limit recursion depth
--files-only               Show only files
--dirs-only                Show only directories
--help                     Show this help message
```

### Examples

```bash
# Show current directory tree
npx @ruskydev/better-tree .

# Ignore node_modules and dist
npx @ruskydev/better-tree src --ignore node_modules dist

# Limit depth to 2
npx @ruskydev/better-tree --depth 2

# Show only directories
npx @ruskydev/better-tree --dirs-only
```

## License
This project is licensed under the [MIT License](LICENSE).