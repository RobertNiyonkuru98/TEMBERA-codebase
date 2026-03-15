import { Decimal } from "@prisma/client/runtime/client";

export function serializeBigInt(value: any): any {
  let result = value;

  if (value === null || value === undefined) {
    // leave result as is
  } else if (typeof value === "bigint") {
    result = Number(value);
  } else if (value instanceof Date || value instanceof Decimal) {
    result = value instanceof Date ? value.toISOString() : value.toString();
  } else if (Array.isArray(value)) {
    result = value.map(serializeBigInt);
  } else if (typeof value === "object") {
    result = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeBigInt(v)]));
  }

  return result;
}
