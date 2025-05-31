declare module "formidable" {
  import type { IncomingMessage } from "http"
  import { File } from "formidable"

  interface Fields {
    [key: string]: string[]
  }

  interface Files {
    [key: string]: File[]
  }

  interface Options {
    uploadDir?: string
    keepExtensions?: boolean
    maxFileSize?: number
    maxFieldsSize?: number
    maxFields?: number
    hashAlgorithm?: string | false
    fileWriteStreamHandler?: () => any
    multiples?: boolean
    encoding?: string
    filter?: (part: any) => boolean
  }

  class IncomingForm {
    constructor(options?: Options)
    parse(req: IncomingMessage): Promise<[Fields, Files]>
  }

  export { IncomingForm, File }
}
