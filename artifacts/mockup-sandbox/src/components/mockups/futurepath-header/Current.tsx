import './_group.css';

// Extracted from FuturePath's shared Head; the translation context is stubbed
// with the existing English strings for this isolated before-reference only.
const t = (value: string) => value;
const Head = ({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) => (<header className="mb-8 rise"><p className="font-mono text-xs uppercase tracking-widest text-primary">{t(kicker)}</p><h1 className="font-display text-4xl md:text-5xl font-semibold mt-1 leading-tight break-words">{t(title)}</h1>{sub && <p className="text-muted-foreground mt-2 max-w-2xl">{t(sub)}</p>}</header>);

export function Current() {
  return <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-sans"><Head kicker="Overview" title="Hello Alex. Here is where you stand." sub="Alex is a clearly labelled synthetic profile. Edit it in Profile to see your own picture." /></div>;
}
