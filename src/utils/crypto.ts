import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RandomReader } from "@oslojs/crypto/random";
import { generateRandomString } from "@oslojs/crypto/random";

export function generateRandomToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export function hashToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const random: RandomReader = {
  read(bytes) {
    crypto.getRandomValues(bytes);
  },
};

export function generateRandomCode() {
  return generateRandomString(random, ALPHABET, 8);
}
