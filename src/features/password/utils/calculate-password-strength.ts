export const strengthLevels = [
  { label: "Very Weak", color: "bg-red-500", width: "w-1/5" },
  { label: "Weak", color: "bg-orange-500", width: "w-2/5" },
  { label: "Okay", color: "bg-yellow-500", width: "w-3/5" },
  { label: "Good", color: "bg-lime-500", width: "w-4/5" },
  { label: "Strong", color: "bg-green-500", width: "w-full" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let zxcvbnModule: any = null;

export type PasswordStrengthResult = {
  score: number; // 0-4
  label: string;
} | null;

export async function calculatePasswordStrength(
  password: string
): Promise<PasswordStrengthResult> {
  if (!password) return null;

  try {
    // Only import once
    if (!zxcvbnModule) {
      zxcvbnModule = (await import("zxcvbn")).default;
    }
    const result = zxcvbnModule(password);

    return {
      score: result.score,
      label: strengthLevels[result.score].label,
    };
  } catch (error) {
    console.error("Failed to load or calculate password stringth:", error);
    return null; // Handle potentialerrors during import or calculaton
  }
}
