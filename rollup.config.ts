import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

/**
 * Rollup plugin that comments lines starting with "exports.xxx"
 * This must be placed before minify/terser rollup plugins (and the reason it hooks on renderChunk instead of generateBundle)
 *
 * Related: https://github.com/rollup/rollup/issues/1893 (output.exports: "none" is not allowed using output.format: "cjs")
 */
const removeExportsPlugin = function () {
    return {
        async renderChunk(bundle) {
            const code =
                bundle
                    .replace(/^exports.*/gm, "//$&")
                    .replace(/^Object\.defineProperty\(exports.*/gm, "//$&")
            return { code, map: null }
        },
    }
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: "src/ts/index.ts",
    output: {
        file: "dist/main.ts",
        format: "cjs",
        strict: false,
    },
    plugins: [
        typescript(),
        removeExportsPlugin(),
        terser({
            compress: false,
            mangle: false,
            format: {
                beautify: true,
                comments: false,
            },
        }),
    ],
}

export default config
