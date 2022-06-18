// [Thank you AdamL](https://stackoverflow.com/a/21231012/7687024)
export const columnToLetter = (column: number): string => {
    let letter = ""
    let temp: number
    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}

// [Thank you AdamL](https://stackoverflow.com/a/21231012/7687024)
export const letterToColumn = (letter: string): number => {
    let column = 0
    const length = letter.length
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
    }
    return column
}
