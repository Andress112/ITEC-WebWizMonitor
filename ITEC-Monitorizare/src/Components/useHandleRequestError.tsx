import Swal from 'sweetalert2';

function errorPopUp(title: string, message: string, duration: number = 10000) {
    Swal.fire({
        title: title,
        text: message,
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: duration,
        timerProgressBar: true,
    });
}
function warnPopUp(title: string, message: string, duration: number = 10000) {
    Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        confirmButtonText: 'Ok',
        timer: duration,
        timerProgressBar: true,
    });
}
function infoPopUp(title: string, message: string, duration: number = 10000) {
    Swal.fire({
        title: title,
        text: message,
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: duration,
        timerProgressBar: true,
    });
}

function useHandleRequestError() {

    const handleRequestError = (status: number) => {

        if (status === 100) { 
            infoPopUp("The username is already in use!", "")
        }
        else if (status === 101) {
            infoPopUp("A user with this email addres already exists", "")
        }
        else if (status === 103) {
            warnPopUp("Invalid username!", "")
        }
        else if (status === 104) {
            warnPopUp("Invalid email!", "")
        }
        else if (status === 105) {
            warnPopUp("Invalid Password!", "")
        }
        else if (status === 550 || status === 500) {
            errorPopUp("An error occurred while trying to signUp!","Please contact the site admin if this keeps happening!")
        }
        else if (status === 551 || status === 501) {
            errorPopUp("An error occurred while trying to login!","Please contact the site admin if this keeps happening!")
        }
        else {
            warnPopUp("A internal error has occured! Code: " + status, "")
        }
    };
    return handleRequestError;
}
export default useHandleRequestError;