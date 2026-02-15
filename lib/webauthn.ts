export function normalizeBuffer(input:any):Buffer{
  if(!input) throw new Error("Missing buffer");

  if(Buffer.isBuffer(input)) return input;

  if(input?.type==="Buffer") return Buffer.from(input.data);

  if(typeof input==="string") return Buffer.from(input,"base64");

  if(input instanceof Uint8Array) return Buffer.from(input);

  throw new Error("Invalid buffer type");
}
