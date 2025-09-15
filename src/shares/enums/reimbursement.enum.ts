export enum ReimbursementStatusEnum {
  UNDRESSED = 'Chưa xử lý',
  CANCEL = 'Hủy',
  PROGRESSING = 'Đang xử lý',
  COMPLETED = 'Hoàn thành',
}

export enum ReimbursementMethodEnum {
  DISCOUNT = 'Giảm tiền đơn hàng',
  TRANSFER = 'Chuyển Khoản',
  RETURN = 'Hoàn hàng',
  REFUND = 'Hoàn tiền',
}

export enum PaymentStatus {
  Unpaid = 'Chưa thanh toán',
  Paid = 'Đã thanh toán',
  PendingConfirmation = 'Chờ xác nhận',
  Cancelled = 'Huỷ',
}

export enum OldStatusEnum {
  UNSENT = 'chưa về kho',
  RECEIVED = 'đã nhận về kho',
}
