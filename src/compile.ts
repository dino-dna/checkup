import * as ts from "typescript";

export function compile(fileNames: string[], options: ts.CompilerOptions) {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  return allDiagnostics
    .map((diagnostic) => {
      if (diagnostic.file) {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      }
      return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    })
    .filter((i) => i);
}
