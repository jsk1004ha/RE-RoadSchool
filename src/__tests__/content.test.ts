import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const banned = ['위험학생', '문제학생', '실패', '중도탈락자', '부적응자', '감시', '예측 대상'];
const allowedFiles = new Set(['prd-re-road-school-demo-site.md', 'test-spec-re-road-school-demo-site.md', 'content.test.ts']);

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) return collectFiles(full);
    return full;
  });
}

describe('content safety and source disclosure', () => {
  it('does not use banned labels in user-facing source files', () => {
    const files = [...collectFiles('src'), 'README.md'];
    for (const file of files) {
      if (allowedFiles.has(file.split('/').pop() ?? '')) continue;
      const text = readFileSync(file, 'utf8');
      for (const word of banned) {
        expect(text.includes(word), `${file} contains ${word}`).toBe(false);
      }
    }
  });

  it('README discloses sources, demo data, non-clinical logic, and regional center coverage', () => {
    const readme = readFileSync('README.md', 'utf8');
    expect(readme).toContain('출처');
    expect(readme).toContain('데모/각색 데이터');
    expect(readme).toContain('비임상 규칙 기반 분석');
    expect(readme).toContain('지역별 지원센터 데이터');
    expect(readme).toContain('https://www.mogef.go.kr');
    expect(readme).toContain('https://www.youth.go.kr');
    expect(readme).toContain('https://www.1388.go.kr');
    expect(readme).toContain('대표 예시');
  });
});
