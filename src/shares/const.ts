export const LIMIT_CRAWLER_TOKEN = 10

// export const UPLOAD_IMG_EXTNAME = /(jpg|jpeg|png|gif|bmp|tif|tiff)$/isu

export const NoAvatarId = 0
export const DefaultAvatarId = 1
export const MinHeartNum = 1
export const MaxHeartNum = 5

export const UUID = "a9b932cb-09a7-457c-9179-78f5a059eb88"
// 3 minutes
export const HeartCountDuration = 3 * 60

export const randomString = () => {
    const randomString = Array.from({ length: 10 }, () => {
        const random = Math.floor(Math.random() * 36)
        if (random < 10) {
            return String.fromCharCode(48 + random)
        } else {
            return String.fromCharCode(65 + random - 10)
        }
    }).join('');
    return randomString
}

export const renPaymentCode = (type: string) => {
    const prefix = type == 'month' ? 'M' : 'F'
    if (!prefix) throw new Error('Loại mã không hợp lệ.');
    return prefix + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
}




