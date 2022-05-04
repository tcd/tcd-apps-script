import typescript from "@rollup/plugin-typescript"

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
    plugins: [typescript()],
}

export default config
