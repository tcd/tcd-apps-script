import { FOLDER_NAME } from "./lib/constants"

const greeter = (person: string) => {
    return `pssst, ${person}, FOLDER_NAME is ${FOLDER_NAME}`
}

const user = "Grant"
Logger.log(greeter(user))
