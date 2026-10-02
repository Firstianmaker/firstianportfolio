import assert from 'node:assert/strict';
import test from 'node:test';
import { newTechnologyLines } from '../src/sanity/inputs/technology-lines';

test('pasted technologies support Windows newlines and preserve existing skills', () => {
  const existing = ['React', 'MySQL'];
  assert.deepEqual(newTechnologyLines(' React\r\nTypeScript\r\n\r\nNestJS\n typescript \nC++\rC#', existing), ['TypeScript', 'NestJS', 'C++', 'C#']);
  assert.deepEqual(existing, ['React', 'MySQL']);
  assert.deepEqual(newTechnologyLines(' \r\n'), []);
  assert.deepEqual(newTechnologyLines('Next.js\nReact Native'), ['Next.js', 'React Native']);
});
