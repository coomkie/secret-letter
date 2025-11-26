export interface AuthFormData {
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    gender?: string;
}

export interface AuthErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
}

export const validateAuthForm = (data: AuthFormData, mode: 'login' | 'register'): AuthErrors => {
    const errors: AuthErrors = {};

    // Email
    if (!data.email) {
        errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Email không hợp lệ';
    }

    // Password
    if (!data.password) {
        errors.password = 'Vui lòng nhập mật khẩu';
    } else if (data.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (mode === 'register') {
        if (!data.username) {
            errors.username = 'Vui lòng nhập tên người dùng';
        }

        if (!data.gender) {
            errors.gender = 'Vui lòng chọn giới tính';
        }

        if (!data.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
    }

    return errors;
};
