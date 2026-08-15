// 构建后把手写类型声明拷贝到 dist/index.d.ts
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
copyFileSync(
  new URL('../declarations/index.d.ts', import.meta.url),
  new URL('../dist/index.d.ts', import.meta.url),
);
console.log('[bigscreen-board] types -> dist/index.d.ts');
