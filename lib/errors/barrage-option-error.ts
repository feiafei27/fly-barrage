import { ErrorCode } from './index.ts';

/**
 * 弹幕配置对象的类型错误
 */
export default class BarrageOptionError extends Error {
  code: ErrorCode;

  constructor(params: {
    message: string;
    code: ErrorCode;
  }) {
    super(params.message);
    this.code = params.code;
  }
}
