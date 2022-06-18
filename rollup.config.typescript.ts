import resolve from "@rollup/plugin-node-resolve"
import tsParser from "./src/js/ts-parser"

/**
 * [Rollup TypeScript -> TypeScript](https://gist.github.com/sstur/6d4036c0df1a113d5b3c1c1e907f9d96)
 *
 * @type {import('rollup').RollupOptions}
 */
const config2 = {
    input: "src/ts/index.ts",
    output: {
        // dir: "output",
        file: "output/main.ts",
        format: "esm",
    },
    plugins: [
        resolve({
            extensions: [".ts"],
        }),
        tsParser(),
    ],
}

export default config2
