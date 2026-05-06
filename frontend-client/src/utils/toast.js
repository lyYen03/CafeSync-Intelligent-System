import Swal from 'sweetalert2';

export const showToast = (title, icon = 'success') => {
    Swal.fire({
        title: title,
        icon: icon,
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#fff',
        color: '#826644',
        iconColor: '#826644',
    });
};

export const showConfirm = async (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#826644',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    });
};