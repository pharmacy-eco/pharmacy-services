export function generateSlug(text) {
    function removeAccents(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    return removeAccents(text)
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
export function formatSlug1(str) {
    const slug = str.toString().toLowerCase().trim().replace(/\//g, '');

    return `/${slug}`;
}

export function formatSlug(str) {
    const slug = str
        .toString()
        .normalize('NFD') // Chuẩn hóa unicode
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Xóa ký tự không phải chữ/số/khoảng trắng
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Khoảng trắng thành dấu -
        .replace(/-+/g, '-') // Gom dấu - liên tiếp
        .replace(/^-+/, '') // Xóa dấu - đầu chuỗi
        .replace(/-+$/, ''); // Xóa dấu - cuối chuỗi

    return slug;
}
