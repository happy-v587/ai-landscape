const fs = require('fs');
const path = require('path');

const skills = [
  {
    name: 'frontend-design',
    targets: [
      { dir: '.claude/skills/frontend-design', label: 'Claude Code' },
      { dir: '.codex/skills/frontend-design', label: 'Codex' },
    ],
  },
];

for (const skill of skills) {
  const canonicalDir = path.join('.agents/skills', skill.name);
  const skillSrc = path.join(canonicalDir, 'SKILL.md');
  const licenseSrc = path.join(canonicalDir, 'LICENSE.txt');

  if (!fs.existsSync(skillSrc)) {
    console.error(`Canonical skill not found: ${skillSrc}`);
    process.exit(1);
  }

  const skillBody = fs.readFileSync(skillSrc, 'utf8');

  for (const target of skill.targets) {
    fs.mkdirSync(target.dir, { recursive: true });

    const relativePath = path.relative(target.dir, skillSrc).split(path.sep).join('/');
    const header = [
      '<!--',
      `  This file is a project-local copy for ${target.label}.`,
      `  Canonical source: ${relativePath}`,
      '  Edit the canonical file; then run `npm run sync-skills` to propagate changes.',
      '-->',
      '',
    ].join('\n');

    fs.writeFileSync(path.join(target.dir, 'SKILL.md'), header + skillBody);

    if (fs.existsSync(licenseSrc)) {
      fs.copyFileSync(licenseSrc, path.join(target.dir, 'LICENSE.txt'));
    }

    console.log(`Synced ${target.dir}/SKILL.md`);
  }
}
