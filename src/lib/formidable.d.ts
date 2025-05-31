// Minimal declaration for formidable to allow import
declare module "formidable" {
  import type { IncomingMessage } from "http"

  interface File {
    filepath: string
    originalFilename: string | null
    mimetype: string | null
    size: number
    newFilename: string
    hash: string | null
    lastModifiedDate: Date | null
  }

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
    hashAlgorithm?: false | "sha1" | "md5"
    fileWriteStreamHandler?: () => any
    headers?: { [key: string]: string }
    multiples?: boolean
    encoding?: string
  }

  class IncomingForm {
    constructor(options?: Options)
    parse(req: IncomingMessage): Promise<[Fields, Files]>
  }

  export { IncomingForm, type File }
}
