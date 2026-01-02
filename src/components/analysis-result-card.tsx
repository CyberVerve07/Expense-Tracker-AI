import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Award, TriangleAlert, CalendarClock, Target, ArrowRight } from 'lucide-react';
import { Separator } from './ui/separator';

type AnalysisOutput = {
  analysisSummary: string;
  keyFindings: string[];
  actionableRecommendations: string[];
  celebratingWins: string;
  gentleChallenges: string;
  nextWeekForecast: string;
};

interface AnalysisResultCardProps {
  result: AnalysisOutput;
}

const Section = ({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
    <div className={className}>
        <h3 className="text-xl font-semibold flex items-center mb-3 font-headline">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="text-foreground/90 text-sm space-y-2">{children}</div>
    </div>
);

export default function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  return (
    <Card className="mt-8 shadow-lg w-full border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          📊 Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg text-foreground">{result.analysisSummary}</p>
        <Separator />
        <Section title="Key Findings" icon={<Target className="text-primary" />}>
            <ul className="list-disc list-inside space-y-2">
                {result.keyFindings.map((finding, index) => <li key={index}>{finding}</li>)}
            </ul>
        </Section>
        <Separator />
        <Section title="Actionable Recommendations" icon={<Lightbulb className="text-primary" />}>
            <ul className="space-y-3">
                {result.actionableRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-1 text-primary shrink-0"/>
                        <span>{rec.replace('→ ', '')}</span>
                    </li>
                ))}
            </ul>
        </Section>
        <Separator />
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center font-headline">
                        <Award className="mr-2 text-primary" />
                        🎉 Celebrating Your Wins
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground">{result.celebratingWins}</p>
                </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center font-headline">
                        <TriangleAlert className="mr-2 text-accent" />
                        ⚠️ Gentle Challenges
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground">{result.gentleChallenges}</p>
                </CardContent>
            </Card>
        </div>
        <Separator />
         <Section title="Next Week Forecast" icon={<CalendarClock className="text-primary" />}>
             <p className="italic">{result.nextWeekForecast}</p>
        </Section>
      </CardContent>
    </Card>
  );
}
