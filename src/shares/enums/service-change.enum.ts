export enum BuyType {
  MONTHLY = 'monthly',
  FULL = 'full',
}

export enum ServiceChangeStatus {
  NOT_PROGRESS = 'Đang xử lý',
  IN_PROGRESS = 'Hoàn thành',
  CANCEL = 'Hủy',
}

export enum SmartpitRequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}

export enum SmartpitStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum SmartpitType {
  NEW = 'NEW_CODE',
  ACTIVE = 'ACTIVE_CODE', 
  EDIT = 'EDIT_CODE',
  COMBINE = 'COMBINE_CODE',
  CUT_CODE = 'CUT_CODE'
}
