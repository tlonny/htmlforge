import { createHash } from "crypto"

export const digest = (value : string) => {
    return createHash("sha256")
        .update(value)
        .digest()
        .subarray(0, 8)
        .toString("hex")
}
