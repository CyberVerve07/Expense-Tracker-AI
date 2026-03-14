import Header from '@/components/layout/header';
import CalendarView from '@/components/calendar-view';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container flex-1 py-8 md:py-10">
        <section className="relative overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(248,250,252,0.95))] px-6 py-10 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.55)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_25%),linear-gradient(135deg,_rgba(2,6,23,0.96),_rgba(15,23,42,0.96))] md:px-10 md:py-14">
          <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] xl:items-end">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                2026 planner
              </div>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 md:text-6xl">
                  Beautiful yearly calendar with real 2026 India holidays.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                  National holidays, gazetted dates, restricted holidays, festivals, and seasonal markers are all mapped into one
                  cleaner calendar. Tap any day to add your own schedule and keep the year useful, not just decorative.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[28px] border border-border/60 bg-background/80 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Coverage</p>
                <p className="mt-2 text-3xl font-black">2026</p>
                <p className="mt-1 text-sm text-muted-foreground">Full-year holiday and festival map.</p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-background/80 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Focus</p>
                <p className="mt-2 text-3xl font-black">5 types</p>
                <p className="mt-1 text-sm text-muted-foreground">Gazetted, restricted, festival, observance, season.</p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-background/80 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Planner</p>
                <p className="mt-2 text-3xl font-black">Daily</p>
                <p className="mt-1 text-sm text-muted-foreground">Each date can still hold your own schedule.</p>
              </div>
            </div>
          </div>
        </section>

        <CalendarView />
      </main>
    </div>
  );
}
