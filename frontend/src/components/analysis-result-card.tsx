import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Award, TriangleAlert, CalendarClock, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';

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
        <h3 className="text-xl font-bold flex items-center mb-4 font-outfit text-gradient-cyan">
            <span className="p-2 rounded-xl bg-white/5 mr-3">{icon}</span>
            {title}
        </h3>
        <div className="text-foreground/90 text-base leading-relaxed space-y-3">{children}</div>
    </div>
);

export default function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        <Card className="mt-12 glass-card border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-24 w-24 text-cyan-400" />
        </div>
        
        <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-outfit font-black tracking-tight flex items-center gap-3">
            AI Intelligence Report
            </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-10 pt-6">
            <p className="text-xl text-foreground font-medium leading-relaxed border-l-4 border-cyan-400 pl-6 py-2 bg-cyan-400/5 rounded-r-2xl">
                {result.analysisSummary}
            </p>
            
            <div className="grid lg:grid-cols-2 gap-12">
                <Section title="Strategic Findings" icon={<Target className="h-5 w-5 text-cyan-400" />}>
                    <ul className="space-y-3">
                        {result.keyFindings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0" />
                                <span>{finding}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Actionable Protocols" icon={<Lightbulb className="h-5 w-5 text-purple-400" />}>
                    <ul className="space-y-3">
                        {result.actionableRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-purple-500/30 transition-colors">
                                <ArrowRight className="h-4 w-4 mt-1 text-purple-400 shrink-0 group-hover:translate-x-1 transition-transform"/>
                                <span>{rec.replace('→ ', '')}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            </div>

            <Separator className="bg-white/10" />

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <motion.div whileHover={{ y: -5 }}>
                    <Card className="bg-cyan-500/10 border-cyan-500/20 rounded-[32px] p-2">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center font-outfit text-cyan-400">
                                <Award className="mr-3 h-6 w-6" />
                                Growth Wins
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base text-foreground/90 leading-relaxed">{result.celebratingWins}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ y: -5 }}>
                    <Card className="bg-magenta-500/10 border-magenta-500/20 rounded-[32px] p-2">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center font-outfit text-magenta-400">
                                <TriangleAlert className="mr-3 h-6 w-6" />
                                Optimization Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base text-foreground/90 leading-relaxed">{result.gentleChallenges}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <Separator className="bg-white/10" />

            <Section title="Predictive Forecast" icon={<CalendarClock className="h-5 w-5 text-indigo-400" />}>
                <p className="text-lg italic font-medium text-indigo-300/90 pl-4 border-l-2 border-indigo-400/30">
                    "{result.nextWeekForecast}"
                </p>
            </Section>
        </CardContent>
        </Card>
    </motion.div>
  );
}
