export const timestamp = (time: Date | null = null): string => {
    time ??= new Date()

    const year  = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, "0")
    const day   = time.getDate().toString().padStart(2, "0")

    const minute = time.getMinutes().toString().padStart(2, "0")
    const second = time.getSeconds().toString().padStart(2, "0")

    const _hour = time.getHours()
    const meridiemIndicator = (_hour > 12) ? "PM" : "AM"

    const hour = ((_hour + 11) % 12 + 1).toString().padStart(2, "0")

    return `${year}-${month}-${day}_${hour}-${minute}-${second}_${meridiemIndicator}`
}
