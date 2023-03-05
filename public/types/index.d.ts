declare module 'vue-captcha-code-alpha' {
  export class CaptchaImage {
    codeLength: number
    codeType: Array<'A' | 'a' | '0'>
    contentWidth: number
    contentHeight: number
    fontSizeMin: number
    fontSizeMax: number
    textColor: string
    textColorMin: number
    textColorMax: number
    textDegMin: number
    textDegMax: number
    backgroundColor: string
    backgroundColorMin: number
    backgroundColorMax: number
    dotCount: number
    dotColorMin: number
    dotColorMax: number
    lineCount: number
    lineColorMin: number
    lineColorMax: number
    refreshable: boolean
  }
}

export declare type CaptchaImageInstance = {
  validate(input: string, ignoreCase?: boolean): boolean
  refresh(): void
  verificationCode: string
}
