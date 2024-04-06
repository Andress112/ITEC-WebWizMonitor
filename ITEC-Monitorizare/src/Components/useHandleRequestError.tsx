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

        if (status === 108) { 
            
        } else if (status === 107) {

        }
        else {
            warnPopUp("A internal error has occured! Code: " + status, "")
        }
    };
    return handleRequestError;
}
export default useHandleRequestError;