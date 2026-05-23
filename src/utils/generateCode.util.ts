export function generateUniqueCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const timestamp = Date.now().toString();

    const timePart = timestamp.slice(-5);

    let letterPart = '';
    for (let i = 0; i < 5; i++) {
        letterPart += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return timePart + letterPart;
}
