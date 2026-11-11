import "server-only"

import { randomUUID } from "node:crypto"
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises"
import { join } from "node:path"

const uploads = join(process.cwd(), "uploads")
const storedName = /^[a-f0-9-]{36}\.(png|jpg)$/
const pngSignature = Buffer.from("89504e470d0a1a0a", "hex")
const jpegFrames = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]

function isPng(bytes: Buffer) {
  if (bytes.length < 45 || !bytes.subarray(0, 8).equals(pngSignature)) return false
  if (bytes.readUInt32BE(8) !== 13 || bytes.toString("ascii", 12, 16) !== "IHDR") return false
  if (bytes.readUInt32BE(16) === 0 || bytes.readUInt32BE(20) === 0) return false

  let hasImageData = false
  for (let offset = 33; offset + 12 <= bytes.length;) {
    const length = bytes.readUInt32BE(offset)
    const type = bytes.toString("ascii", offset + 4, offset + 8)
    offset += length + 12
    if (offset > bytes.length) return false
    if (type === "IDAT" && length > 0) hasImageData = true
    if (type === "IEND") return hasImageData && length === 0 && offset === bytes.length
  }
  return false
}

function isJpeg(bytes: Buffer) {
  if (bytes.length < 16 || bytes.readUInt16BE(0) !== 0xffd8) return false
  if (bytes.readUInt16BE(bytes.length - 2) !== 0xffd9) return false

  let hasFrame = false
  for (let offset = 2; offset + 4 < bytes.length;) {
    if (bytes[offset++] !== 0xff) return false
    while (bytes[offset] === 0xff) offset++
    const marker = bytes[offset++]
    if (offset + 2 > bytes.length) return false
    const length = bytes.readUInt16BE(offset)
    if (length < 2 || offset + length >= bytes.length - 2) return false
    if (jpegFrames.includes(marker)) {
      hasFrame = length >= 8 && bytes.readUInt16BE(offset + 3) > 0 && bytes.readUInt16BE(offset + 5) > 0
    }
    if (marker === 0xda) return hasFrame && length >= 6
    offset += length
  }
  return false
}

export async function saveOrderImage(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer())
  const extension = isPng(bytes) ? "png" : isJpeg(bytes) ? "jpg" : null
  if (!extension) return null

  const name = `${randomUUID()}.${extension}`
  await mkdir(uploads, { recursive: true })
  try {
    await writeFile(join(uploads, name), bytes, { flag: "wx" })
  } catch (error) {
    if (!hasCode(error, "EEXIST")) await removeOrderImage(name)
    throw error
  }
  return name
}

function hasCode(error: unknown, code: string) {
  return error instanceof Error && "code" in error && error.code === code
}

export async function removeOrderImage(name: string | null) {
  if (!name || !storedName.test(name)) return
  try {
    await unlink(join(uploads, name))
  } catch (error) {
    if (!hasCode(error, "ENOENT")) console.error(error)
  }
}

export async function readOrderImage(name: string) {
  if (!storedName.test(name)) return null
  try {
    return {
      bytes: await readFile(join(uploads, name)),
      contentType: name.endsWith(".png") ? "image/png" : "image/jpeg",
    }
  } catch (error) {
    if (hasCode(error, "ENOENT")) return null
    throw error
  }
}
