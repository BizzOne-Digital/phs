/** Normalize MongoDB / Mongoose binary fields to a Node Buffer. */
export function storedDataToBuffer(data: unknown): Buffer | null {
  if (data == null) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;

  if (obj._bsontype === "Binary" && obj.buffer instanceof Uint8Array) {
    return Buffer.from(obj.buffer);
  }

  if (obj.buffer instanceof Uint8Array || ArrayBuffer.isView(obj.buffer)) {
    return Buffer.from(obj.buffer as Uint8Array);
  }

  if (Array.isArray(obj.data)) {
    return Buffer.from(obj.data as number[]);
  }

  return null;
}
