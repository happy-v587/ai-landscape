import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupBySubcategory } from './MapShell';
import { SectionCard } from './SectionCard';
import { SubcategoryRow } from './SubcategoryRow';
import { ItemChip } from './ItemChip';

export function ModelInfraMap({
  entries,
  locale,
  categoryLabels,
}: {
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div>
      {groupBySubcategory(entries).map(({ category, subcategories }) => (
        <SectionCard key={category} category={categoryLabels[category] ?? category}>
          {Object.entries(subcategories).map(([subcategory, group]) => (
            <SubcategoryRow key={subcategory} label={subcategory}>
              {group.map((entry) => (
                <ItemChip key={entry.id} entry={entry} locale={locale} size="primary" />
              ))}
            </SubcategoryRow>
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
