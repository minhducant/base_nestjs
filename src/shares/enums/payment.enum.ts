export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
  NEW = 'NEW',
  PAYMENTED = 'PAYMENTED',
  WAITING = 'WAITING',
}

export enum PaymentTypeEnum {
  ORDER = 'ORDER',
  MONTHLY_FEE = 'MONTHLY_FEE',
  CSKH = 'CSKH',
  HISTORIES = 'HISTORIES',
}

export enum CSKHTypeEnum {
  KEEPING = 'KEEPING',
  GUARANTEE = 'GUARANTEE',
  MAINTAIN = 'MAINTAIN',
  REIMBURSEMENT = 'REIMBURSEMENT',
  SERVICE_CANCEL = 'SERVICE_CANCEL',
  SERVICE_CHANGE = 'SERVICE_CHANGE',
}

export enum PaymentMethodEnum {
  BANK = 'BANK',
  COMBINI = 'COMBINI',
  DAIBIKI = 'DAIBIKI',
  VISA = 'VISA',
  OFFICE = 'OFFICE',
}

export enum PaymentType {
  MONTHLY = 'MONTHLY',
  FULL = 'FULL'
}

export enum StatusMapping {
  SOLD = "Đã bán",
  ACTIVE = "Trong kho (Văn phòng)",
  INACTIVE = "Dừng quản lý",
  LOCKED = "Không dùng",
  IN_STOCK = "Trong kho",
  APPLIED = "Đã lên đơn",
  SHIPPING = "Đang vận chuyển",
  USE = "Đang sử dụng",
  RETURNING = "Đang đổi trả",
  NETWORK_IS_CUT = "Đã cắt mạng",
  NETWORK_IS_OPEN = "Đang mở mạng",
  SAIHAKKO = "Đang saihakko",
  EXPIRED = "Hết hạn",
  CANCEL_THE_CONTRACT = "Hủy hợp đồng",
  MAINTAINING = "Đang bảo trì",
  HOLD = "Giữ hộ",
}