import type { StatsProps, School } from "@shared/schema";
import { GraduationCap, Users, Calendar, Trophy } from "lucide-react";

interface StatsSectionProps {
  props: StatsProps;
  school: School;
}

const defaultStats = [
  { value: "2500+", label: "Happy Students", icon: GraduationCap, color: "from-blue-400 to-cyan-400" },
  { value: "150+", label: "Expert Teachers", icon: Users, color: "from-purple-400 to-pink-400" },
  { value: "50+", label: "Years of Excellence", icon: Calendar, color: "from-orange-400 to-yellow-400" },
  { value: "95%", label: "Success Rate", icon: Trophy, color: "from-green-400 to-emerald-400" },
];

export function StatsSection({ props, school }: StatsSectionProps) {
  const primaryColor = `var(--theme-primary, ${school.primaryColor})`;
  const secondaryColor = `var(--theme-secondary, ${school.secondaryColor})`;
  const stats = props.stats?.length ? props.stats : defaultStats.map(s => ({ value: s.value, label: s.label }));

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, #7c3aed 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 animate-pulse"
        />
        <div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            data-testid="text-stats-heading"
          >
            {props.heading || "Numbers That Speak"}
          </h2>
          <p className="text-white/70 text-lg">Our journey of excellence in numbers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const defaultStat = defaultStats[index] || defaultStats[0];
            const Icon = defaultStat.icon;
            
            return (
              <div
                key={index}
                className="relative group"
                data-testid={`stat-${index}`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${defaultStat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
