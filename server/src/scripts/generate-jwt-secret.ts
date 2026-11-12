import { randomBytes } from "node:crypto";
import { mkdir, open, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputArgument = process.argv[2] ?? "secrets/jwt.key";

if (!outputArgument.trim()) {
  throw new Error("JWT secret output path must not be empty");
}

const outputPath = resolve(outputArgument);

function hasErrorCode(
  error: unknown,
  code: string,
): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === code
  );
}

async function generateJwtSecret(): Promise<void> {
  const secret = randomBytes(32).toString("base64url");

  await mkdir(dirname(outputPath), {
    recursive: true,
    mode: 0o700,
  });

  let fileHandle:
    | Awaited<ReturnType<typeof open>>
    | undefined;

  let fileCreated = false;

  try {
    fileHandle = await open(outputPath, "wx", 0o600);
    fileCreated = true;

    await fileHandle.writeFile(`${secret}\n`, "utf8");
    await fileHandle.sync();
  } catch (error) {
    await fileHandle?.close().catch(() => undefined);

    if (fileCreated) {
      await unlink(outputPath).catch(() => undefined);
    }

    if (hasErrorCode(error, "EEXIST")) {
      throw new Error(
        "JWT secret already exists. Refusing to overwrite it.",
      );
    }

    throw error;
  }

  await fileHandle.close();

  process.stdout.write(
    "JWT secret generated successfully.\n",
  );
}

generateJwtSecret().catch((error: unknown) => {
  process.stderr.write(
    `JWT secret generation failed: ${
      error instanceof Error ? error.message : "Unknown error"
    }\n`,
  );

  process.exitCode = 1;
});
