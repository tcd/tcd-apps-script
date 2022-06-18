import { parse } from "@typescript-eslint/typescript-estree"

/**
 * [Rollup TypeScript -> TypeScript](https://gist.github.com/sstur/6d4036c0df1a113d5b3c1c1e907f9d96)
 */
export default function tsParser() {
    return {
        name: "ts-parser",

        transform(code, filePath) {
            let ast = parse(code, {
                comment: false,
                errorOnUnknownASTType: false,
                filePath,
                loc: false,
                loggerFn: undefined,
                range: true,
                tokens: false,
            })
            return {
                code,
                ast: addStartEnd(ast),
                map: undefined,
            }
        },
    }
}

// This removes the `range` tuple and adds start/end properties instead
function addStartEnd(node) {
    if (Array.isArray(node)) {
        return node.map((node) => addStartEnd(node))
    }
    if (node != null && typeof node === "object") {
        let { range, ...otherProps } = node
        let normalizedProps = {}
        for (let [key, value] of Object.entries(otherProps)) {
            normalizedProps[key] = addStartEnd(value)
        }
        if (Array.isArray(range)) {
            let [start, end] = range
            return { start, end, ...normalizedProps }
        } else {
            return normalizedProps
        }
    }
    return node
}
