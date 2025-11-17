import { createHash } from "crypto"

export const digest = (...values : string[]) => {
    const hash = createHash("sha256")
    for (const value of values) {
        hash.update(value)
    }

    return hash
        .digest()
        .subarray(0, 8)
        .toString("base64url")
}
