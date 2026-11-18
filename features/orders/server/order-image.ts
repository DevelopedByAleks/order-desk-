import "server-only"

import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const storedOrderImageName = /^[a-f0-9-]{36}\.(png|jpg)$/

export async function readOrderImage(name: string) {
  if (!storedOrderImageName.test(name)) return null
  try {
    return {
      bytes: await readFile(join(process.cwd(), "uploads", name)),
      contentType: name.endsWith(".png") ? "image/png" : "image/jpeg",
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null
    throw error
  }
}
