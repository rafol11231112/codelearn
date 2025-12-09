export function obfuscateSolution(solution: string): string {
  return Buffer.from(solution).toString('base64');
}

export function deobfuscateSolution(obfuscated: string): string {
  try {
    return Buffer.from(obfuscated, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

export function scrambleCode(code: string): string {
  const parts = code.split('\n');
  const encoded = parts.map(line => {
    return Buffer.from(line).toString('base64');
  });
  return JSON.stringify(encoded);
}

export function unscrambleCode(scrambled: string): string {
  try {
    const parts = JSON.parse(scrambled);
    return parts.map((encoded: string) => {
      return Buffer.from(encoded, 'base64').toString('utf-8');
    }).join('\n');
  } catch {
    return '';
  }
}

