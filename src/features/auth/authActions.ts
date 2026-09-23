import { createServerFn } from "@tanstack/react-start";

type AuthActionResult =
  | { ok: true; signedIn: boolean }
  | { ok: false; message: string };

type EmailPassword = {
  email: string;
  password: string;
};

function parseEmailPassword(data: unknown): EmailPassword {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid credentials");
  }
  const record = data as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const password = typeof record.password === "string" ? record.password : "";
  if (!email.includes("@") || password.length < 8) {
    throw new Error("Enter a valid email and a password of at least 8 characters.");
  }
  return { email, password };
}

function parseEmail(data: unknown): string {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid email");
  }
  const raw = (data as Record<string, unknown>).email;
  if (typeof raw !== "string") {
    throw new Error("Enter a valid email address.");
  }
  const email = raw.trim().toLowerCase();
  if (!email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export const signInWithEmail = createServerFn({ method: "POST" })
  .validator(parseEmailPassword)
  .handler(async ({ data }): Promise<AuthActionResult> => {
    const { signInWithEmailOnServer } = await import("@/features/auth/authActions.server");
    return signInWithEmailOnServer(data.email, data.password);
  });

export const signUpWithEmail = createServerFn({ method: "POST" })
  .validator(parseEmailPassword)
  .handler(async ({ data }): Promise<AuthActionResult> => {
    const { signUpWithEmailOnServer } = await import("@/features/auth/authActions.server");
    return signUpWithEmailOnServer(data.email, data.password);
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({ email: parseEmail(data) }))
  .handler(async ({ data }): Promise<AuthActionResult> => {
    const { requestPasswordResetOnServer } = await import("@/features/auth/authActions.server");
    return requestPasswordResetOnServer(data.email);
  });
