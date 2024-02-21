/**
 * 定义错误类型对应的 code
 */
export enum ErrorCode {
  /** 固定弹幕的持续时间应该大于 0 */
  FIXED_DURATION_ERROR = 1,

  /** 高级弹幕的生存时间应该大于 0 */
  SENIOR_TOTAL_ERROR = 2,

  /** 高级弹幕的延迟时间应该大于等于 0 */
  SENIOR_DELAY_ERROR = 3,

  /** 高级弹幕的运动时长应该大于等于 0 */
  SENIOR_MOTION_ERROR = 4,
}
