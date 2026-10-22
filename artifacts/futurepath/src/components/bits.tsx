import { type ReactNode } from 'react';
import { AlertTriangle, Compass } from 'lucide-react';
export const Skel = ({ n = 3, h = 'h-24' }: { n?: number; h?: string }) => (<div className="space-y-3" data-testid="state-loading">{Array.from({ length: n }).map((_, i) => <div key={i} className={`skel ${h}`} />)}</div>);
export const ErrorBox = ({ msg, retry }: { msg: string; retry?: () => void }) => (
  <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 flex gap-3 items-start" data-testid="state-error"><AlertTriangle className="text-destructive shrink-0" /><div><p className="font-medium">{msg}</p>{retry && <button onClick={retry} data-testid="button-retry" className="mt-2 text-sm underline">Try again</button>}</div></div>);
export const Empty = ({ title, body, children }: { title: string; body: string; children?: ReactNode }) => (
  <div className="rounded-xl border-2 border-dashed p-10 text-center" data-testid="state-empty"><Compass className="mx-auto mb-3 text-primary" /><h3 className="font-display text-xl">{title}</h3><p className="text-muted-foreground mt-1 mb-4 text-sm max-w-md mx-auto">{body}</p>{children}</div>);
export const Meter = ({ v, color = 'bg-primary' }: { v: number; color?: string }) => (<div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`bar h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, v))}%` }} /></div>);
export const Head = ({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) => (<header className="mb-8 rise"><p className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</p><h1 className="font-display text-4xl md:text-5xl font-semibold mt-1 leading-tight">{title}</h1>{sub && <p className="text-muted-foreground mt-2 max-w-2xl">{sub}</p>}</header>);
export const fmt = (d: string) => { const x = new Date(d); return isNaN(+x) ? d : x.toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' }); };
