export const maintainStatusMap = {
  WAITING_DELIVERY: 'Chờ nhận',
  RECEIVED: 'Đã nhận',
  NOT_RECEIVED: 'Không nhận',
  CANCELED: 'Huỷ',
}

export const oldProductStatusMap = {
  SOLD: 'Đã bán',
  ACTIVE: 'Trong kho (Văn phòng)',
  INACTIVE: 'Dừng quản lý',
  LOCKED: 'Không dùng',
  IN_STOCK: 'Trong kho',
  APPLIED: 'Đã lên đơn',
  SHIPPING: 'Đang vận chuyển',
  USE: 'Đang sử dụng',
  RETURNING: 'Đang đổi trả',
  NETWORK_IS_CUT: 'Đã cắt mạng',
  NETWORK_IS_OPEN: 'Đang mở mạng',
  SAIHAKKO: 'Đang saihakko',
  EXPIRED: 'Hết hạn',
  CANCEL_THE_CONTRACT: 'Hủy hợp đồng',
  MAINTAINING: 'Đang bảo trì',
  HOLD: 'Giữ hộ',
}

export const statusMap = {
  WAITING_DELIVERY: 'Chờ nhận',
  RECEIVED: 'Đã nhận',
  NOT_RECEIVED: 'Không nhận',
  CANCELED: 'Huỷ',
  PENDING: 'Chưa xử lý',
  PROCESSING: 'Đang xử lý',
  NEED_CONFIRM: 'Cần xác nhận lại',
  CONFIRMED: 'Đã xác nhận',
  TRANSFERRED: 'Đã được chuyển đi',
  COMPLETED: 'Hoàn thành',
  CONTRACT_TERMINATED: 'Ngưng hợp đồng',
}

export enum OldStatusEnum {
  UNSEND = 'Chưa gửi',
  SENT = 'Đã gửi',
  IN_STOCK = 'Đã nhận về kho',
  UNWITHDRAWN = 'Không cần thu hồi',
}

