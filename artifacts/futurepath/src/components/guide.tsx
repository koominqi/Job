import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/** A question and answer. Pass strings that are already translated. */
export type QA = { id: string; q: string; a: ReactNode };

/** Page-level questions and answers, always placed at the bottom of a page. */
export function FAQ({ items, testId }: { items: QA[]; testId: string }) {
  const { t } = useLanguage();
  const headingId = `${testId}-heading`;
  return (
    <section className="mt-12" aria-labelledby={headingId} data-testid={testId}>
      <h2 id={headingId} className="flex items-center gap-2 font-display text-xl"><MessageCircleQuestion size={19} className="text-primary" aria-hidden="true" />{t('Questions & answers')}</h2>
      <div className="mt-3 divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
        {items.map((item) => (
          <details key={item.id} className="group" data-testid={`faq-${item.id}`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden" data-testid={`toggle-faq-${item.id}`}>
              <span className="flex-1">{item.q}</span>
              <ChevronDown size={16} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="space-y-2 px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** A plain-language fact row with a small label. */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useLanguage();
  return <p><b className="font-medium text-foreground">{t(label)}</b> {children}</p>;
}

/** A slim link to the next page in the journey. */
export function NextLink({ href, label, testId }: { href: string; label: string; testId: string }) {
  const { t } = useLanguage();
  return (
    <Link href={href} className="group mt-10 flex items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 transition-colors hover:bg-primary/10" data-testid={testId}>
      <span className="min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-widest text-accent">{t('Next')}</span>
        <span className="font-display text-lg">{t(label)}</span>
      </span>
      <ArrowRight size={18} className="shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
