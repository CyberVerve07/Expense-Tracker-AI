import Header from '@/components/layout/header';
import CalendarView from '@/components/calendar-view';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent/80">
                Yearly Tracker 2026
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your year at a glance, with holidays, events, and seasonal themes.
            </p>
        </div>
        <CalendarView />
      </main>
    </div>
  );
}
