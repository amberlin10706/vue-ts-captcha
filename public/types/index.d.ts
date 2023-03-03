declare module 'vue-captcha-code-alpha' {
  export class CaptchaImage {
    verify(input: string, ignoreCase?: boolean): boolean
    refresh(): void
    verificationCode: string
  }
}
