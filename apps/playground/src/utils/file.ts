import { type BundlerInput, extractInputFileExtension, resolveIndexInput } from '@opendatacapture/instrument-bundler';
import { P, match } from 'ts-pattern';

import type { EditorFile } from '@/models/editor-file.model';

export type FileType = 'asset' | 'css' | 'html' | 'javascript' | 'typescript';

export function inferFileType(filename: string): FileType | null {
  return match(extractInputFileExtension(filename))
    .with('.css', () => 'css' as const)
    .with(P.union('.js', '.jsx'), () => 'javascript' as const)
    .with(P.union('.ts', '.tsx'), () => 'typescript' as const)
    .with(P.union('.jpeg', '.jpg', '.png', '.webp'), () => 'asset' as const)
    .with(P.union('.html', '.svg'), () => 'html' as const)
    .with(null, () => null)
    .exhaustive();
}

export function isImageLikeFileExtension(filename: string) {
  return ['.jpeg', '.jpg', '.png', '.svg', '.webp'].includes(extractInputFileExtension(filename)!);
}

export function editorFileToInput(file: EditorFile): BundlerInput {
  const fileType = inferFileType(file.name);
  if (fileType !== 'asset') {
    return file;
  }
  return { ...file, content: Uint8Array.from(atob(file.content), (c) => c.charCodeAt(0)) };
}

export function isBase64EncodedFileType(filename: string) {
  return ['.jpeg', '.jpg', '.png', '.webp'].includes(extractInputFileExtension(filename)!);
}

export function resolveIndexFile(files: EditorFile[]) {
  return files.length ? resolveIndexInput(files) : null;
}

export function resolveIndexFilename(files: EditorFile[]) {
  return resolveIndexFile(files)?.name ?? null;
}

export function getImageMIMEType(filename: string) {
  switch (extractInputFileExtension(filename)) {
    case '.jpeg':
      return 'image/jpeg';
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    default:
      return null;
  }
}
