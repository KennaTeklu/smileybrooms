declare module "twilio" {
  interface TwilioClient {
    messages: {
      create(options: {
        body: string
        from: string
        to: string
      }): Promise<any>
    }
  }

  function twilio(accountSid: string, authToken: string): TwilioClient
  export = twilio
}
