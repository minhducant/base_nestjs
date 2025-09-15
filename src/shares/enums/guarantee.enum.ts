export enum OldStatusEnum {
  UNSENT = 'chưa gửi',
  SENT = 'đã gửi',
  RECEIVED = 'đã nhận về kho',
  NOT_REDEEM = 'không cần thu hồi',
}

export enum IssueEnum {
  WEAK_NETWORK = 'Mạng yếu',
  LOSS_CONNECTION = 'Mất mạng',
  DATA = 'Hết dung lượng',
  CUT_MISTAKE = 'Cắt nhầm mạng',
  DEFECT_DEVICE = 'Thiết bị hỏng',
  UNKNOW_DEVICE = 'Không biết cài thiết bị',
  NEW_DEVICE = 'Mua thiết bị mới',
  PUK_CODE = 'Mã PUK',
}

export enum StatusEnum {
  UNDRESSED = 'Chưa xử lý',
  CANCEL = 'Hủy',
  PROGRESSING = 'Đang xử lý',
  COMPLETED = 'Hoàn thành',
}

// export enum OldStatusEnum {
//   UNDRESSED = 'Chưa xử lý',
//   CANCEL = 'Hủy',
//   PROGRESSING = 'Đang xử lý',
//   COMPLETED = 'Hoàn thành',
//   ORDER_STATUS = 'Trạng thái đơn hàng',
// }

export enum PaymentStatus {
  Unpaid = 'Chưa thanh toán',
  Paid = 'Đã thanh toán',
  PendingConfirmation = 'Chờ xác nhận',
  Cancelled = 'Huỷ',
}

export enum CuttingNumberEnum {
  NUMBER1 = 'Đợt 1',
  NUMBER2 = 'Đợt 2',
}

export enum PaySideEnum {
  CUSTOMER = 'Khách hàng',
  HALLO = 'Hallo',
}

export enum PaymentStatusEnum {}
// CUSTOMER = 'Khách hàng',
// HALLO = 'Hallo',
