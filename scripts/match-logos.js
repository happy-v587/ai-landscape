const fs = require('fs');
const path = require('path');
const { parse } = require('yaml');

const itemsDir = path.join(process.cwd(), 'data/items');
const slugsFile = '/tmp/simpleicons-slugs.md';

const slugContent = fs.readFileSync(slugsFile, 'utf8');
const brands = []; // { name, slug }
const lines = slugContent.split('\n');
for (const line of lines) {
  const match = line.match(/^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|$/);
  if (match && !line.includes('Brand name')) {
    brands.push({ name: match[1].trim(), slug: match[2].trim() });
  }
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const slugMap = new Map(brands.map(b => [normalize(b.name), b.slug]));
const slugSet = new Set(brands.map(b => b.slug));

const files = fs.readdirSync(itemsDir).filter(f => f.endsWith('.yaml'));
const entries = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(itemsDir, file), 'utf8');
  const parsed = parse(content);
  if (parsed.map === 'models') continue;
  if (parsed.logo) continue;
  entries.push({ file, ...parsed });
}

const matches = [];
const noMatches = [];
for (const entry of entries) {
  const enName = entry.name?.en || '';
  const zhName = entry.name?.zh || '';
  const website = entry.website || '';
  const domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const domainMain = domain.split('.')[0];
  
  const candidates = [
    { val: normalize(enName), type: 'name' },
    { val: normalize(zhName), type: 'zh' },
    { val: normalize(domainMain), type: 'domain' },
    { val: normalize(domain), type: 'fulldomain' },
  ];
  
  let found = null;
  for (const c of candidates) {
    if (slugMap.has(c.val)) {
      found = { slug: slugMap.get(c.val), type: c.type };
      break;
    }
    if (slugSet.has(c.val)) {
      found = { slug: c.val, type: c.type };
      break;
    }
  }
  
  // Try partial brand name match for compound names like "Hugging Face Accelerate"
  if (!found) {
    const normName = normalize(enName);
    for (const b of brands) {
      const normBrand = normalize(b.name);
      if (normName.includes(normBrand) || normBrand.includes(normName)) {
        if (normName.length > 3 && normBrand.length > 3) {
          found = { slug: b.slug, type: 'partial' };
          break;
        }
      }
    }
  }
  
  if (found) {
    matches.push({ file: entry.file, name: enName, slug: found.slug, type: found.type });
  } else {
    noMatches.push({ file: entry.file, name: enName, domain });
  }
}

console.log('=== Matches ===');
for (const m of matches) {
  console.log(`${m.file}: ${m.name} [${m.type}] -> https://cdn.simpleicons.org/${m.slug}`);
}
console.log(`\nMatched: ${matches.length}/${entries.length}`);
console.log('\n=== No matches (sample) ===');
for (const m of noMatches.slice(0, 80)) {
  console.log(`${m.file}: ${m.name} (${m.domain})`);
}
