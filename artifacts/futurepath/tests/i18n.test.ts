import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { messages } from '../src/lib/i18n/messages';
import { contentMessages } from '../src/lib/i18n/content';
import { guidanceMessages } from '../src/lib/i18n/guidance';
import { translate } from '../src/lib/i18n';
import { matchExplanation, pathwaySummary, signalWarning } from '../src/lib/i18n/career-text';
import { badgeShelf, shouldReplanPathway } from '../src/lib/learning';

const dictionary = { ...messages, ...contentMessages, ...guidanceMessages };
const root = new URL('../src/', import.meta.url);
const untranslatedNames = new Set(['Python', 'SQL']);

test('every translation has both languages and preserves interpolation variables', () => {
  const variables = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const [english, alternatives] of Object.entries(dictionary)) {
    assert.equal(alternatives.length, 2, english);
    for (const text of alternatives) {
      assert.ok(text.trim(), english);
      assert.deepEqual(variables(text), variables(english), english);
    }
  }
});

test('all literal translation calls and shared heading/error labels have translations', () => {
  const ownedComponents = (directory: URL): URL[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (entry.isDirectory()) return entry.name === 'ui' ? [] : ownedComponents(new URL(`${entry.name}/`, directory));
      return entry.name.endsWith('.tsx') ? [new URL(entry.name, directory)] : [];
    });
  const files = [
    ...ownedComponents(new URL('pages/', root)),
    ...ownedComponents(new URL('components/', root)),
    ...['App.tsx', 'lib/i18n/career-text.ts'].map((f) => new URL(f, root)),
  ];
  let checked = 0;
  const missing: string[] = [];
  for (const file of files) {
    const source = ts.createSourceFile(fileURLToPath(file), readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (text: string) => {
      if (!text || untranslatedNames.has(text) || /^\d+[.)]?$/.test(text)) return;
      if (!dictionary[text]) missing.push(`${file.pathname}: ${text}`);
      checked++;
    };
    function checkStaticAlternatives(node: ts.Node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) check(node.text);
      if (ts.isConditionalExpression(node)) {
        checkStaticAlternatives(node.whenTrue);
        checkStaticAlternatives(node.whenFalse);
      }
    }
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't' && node.arguments[0]) checkStaticAlternatives(node.arguments[0]);
      if (ts.isJsxAttribute(node) && ['title', 'sub', 'kicker', 'msg', 'body', 'desc', 'label'].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) check(node.initializer.text);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(missing, [], 'Owned guidance must be translated in both supported non-English languages');
  assert.ok(checked > 100);
});

test('role, skill and SDG catalog names plus descriptions and outcomes are covered', () => {
  const catalog = readFileSync(new URL('../../api-server/src/lib/career-catalog.ts', import.meta.url), 'utf8');
  for (const match of catalog.matchAll(/skill\("[^"]+", "([^"]+)", "([^"]+)"/g)) {
    for (const name of match.slice(1)) assert.ok(dictionary[name] || untranslatedNames.has(name), name);
  }
  for (const match of catalog.matchAll(/role\("[^"]+", "([^"]+)", "([^"]+)", "([^"]+)",[^\n]+, "(rising|declining)", "([^"]+)"\)/g)) {
    for (const text of match.slice(1)) assert.ok(dictionary[text], text);
  }
  const goals = JSON.parse(`[${catalog.match(/const sdgNames = \[([^\]]+)\]/)![1]}]`) as string[];
  assert.equal(goals.length, 17);
  goals.forEach((goal) => assert.ok(dictionary[goal], goal));
  for (const match of catalog.matchAll(/outcome: "([^"]+)"/g)) assert.ok(dictionary[match[1]], match[1]);
});

test('interpolation keeps values and source names without translating stored identifiers', () => {
  assert.equal(translate('en', 'Remove {name}', { name: 'sample.pdf' }), 'Remove sample.pdf');
  assert.equal(translate('ms', 'Remove {name}', { name: 'sample.pdf' }), 'Buang sample.pdf');
  assert.equal(translate('zh-CN', 'Remove {name}', { name: 'sample.pdf' }), '移除 sample.pdf');
  assert.equal(translate('ms', 'Kaggle Learn'), 'Kaggle Learn');
  assert.equal(translate('zh-CN', 'Python'), 'Python');
});

test('dynamic score explanations retain weights, penalties and unavailable-feed guardrails', () => {
  const text = '2 of 6 role skills matched. 65% skill readiness + 15% sector interest + 20% observed keyword demand. A 8-point scenario assumption is applied for routine-task exposure. Experience is context only, not a demographic proxy; years of experience do not determine suitability.';
  const unavailable = '2 of 6 role skills matched. Feed unavailable: 85% readiness + 15% sector interest; market demand excluded. Experience is context only, not a demographic proxy; years of experience do not determine suitability.';
  assert.equal(matchExplanation(text, (k, p) => translate('en', k, p)), text);
  for (const language of ['ms', 'zh-CN'] as const) {
    const t = (k: string, p?: Record<string, string | number>) => translate(language, k, p);
    const output = matchExplanation(text, t);
    assert.ok(output.includes('65%') && output.includes('15%') && output.includes('20%') && output.includes('8'));
    assert.doesNotMatch(output, /role skills matched|observed keyword|Experience is context/);
    assert.doesNotMatch(matchExplanation(unavailable, t), /Feed unavailable|market demand excluded/);
    assert.doesNotMatch(pathwaySummary('3 learning steps toward Data Analyst, based on your current skills and 6 hours per week.', t), /learning steps toward|Data Analyst|hours per week/);
    assert.doesNotMatch(signalWarning('Refresh failed. Showing the last successful snapshot with its original fetch date. Global remote-job sample, not Malaysian market statistics. Skill demand and scenario scores are estimates, not guarantees.', t), /Refresh failed|Global remote-job|not guarantees/);
  }
});

test('badges: one per pathway skill plus a finisher trophy, all from reversible completion', () => {
  const steps = [{ id: 'a', skillId: 'python' }, { id: 'b', skillId: 'sql' }, { id: 'c', skillId: 'cloud' }];
  const none = badgeShelf(steps, []);
  assert.deepEqual(none.skills.map((b) => [b.skillId, b.order, b.earned]), [['python', 1, false], ['sql', 2, false], ['cloud', 3, false]]);
  assert.deepEqual([none.completed, none.earned, none.total, none.finished], [0, 0, 4, false]);
  const some = badgeShelf(steps, ['b', 'stale-step-from-old-plan']);
  assert.deepEqual(some.skills.filter((b) => b.earned).map((b) => b.skillId), ['sql']);
  assert.deepEqual([some.completed, some.earned, some.finished], [1, 1, false]);
  const all = badgeShelf(steps, ['c', 'a', 'b']);
  assert.deepEqual([all.completed, all.earned, all.total, all.finished], [3, 4, 4, true]);
  assert.deepEqual(badgeShelf(steps, ['a', 'b']).finished, false, 'undoing a step removes the trophy');
  const empty = badgeShelf([], ['a']);
  assert.deepEqual([empty.completed, empty.earned, empty.total, empty.finished], [0, 0, 0, false]);
});

test('a pathway re-plans only for a changed available snapshot and a selected role', () => {
  assert.equal(shouldReplanPathway('', 'snapshot-2', 'live', 'data-analyst'), false);
  assert.equal(shouldReplanPathway('snapshot-1', 'snapshot-1', 'live', 'data-analyst'), false);
  assert.equal(shouldReplanPathway('snapshot-1', 'snapshot-2', 'unavailable', 'data-analyst'), false);
  assert.equal(shouldReplanPathway('snapshot-1', 'snapshot-2', 'live', null), false);
  assert.equal(shouldReplanPathway('snapshot-1', 'snapshot-2', 'cached', 'data-analyst'), true);
});
