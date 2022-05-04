const FOLDER_NAME = "tcd-apps-script-output";

const greeter = (person) => {
    return `pssst, ${person}, FOLDER_NAME is ${FOLDER_NAME}`;
};
const user = "Grant";
Logger.log(greeter(user));
