import type { School } from "@shared/schema";
import { Award, Star, Shield, Medal } from "lucide-react";

interface AwardsSectionProps {
  school: School;
}

const awards = [
  {
    icon: Award,
    title: "Excellence Award",
    description: "Recognized for outstanding academic performance and student achievements in national competitions.",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: Star,
    title: "Top Rated School",
    description: "Ranked among the top schools in the region for holistic education and student development.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Green Campus",
    description: "Awarded for sustainable practices and environmental consciousness in education.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Medal,
    title: "Sports Excellence",
    description: "Honored for outstanding achievements in inter-school sports and athletic programs.",
    color: "from-orange-400 to-red-500",
  },
];

export function AwardsSection({ school }: AwardsSectionProps) {
  const accentColor = `var(--theme-accent, #fbbf24)`;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border rounded-full" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-20 right-20 w-60 h-60 border rounded-full" style={{ borderColor: accentColor }} />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 border rounded-full" style={{ borderColor: accentColor }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentColor})` }} />
            <Award className="w-8 h-8" style={{ color: accentColor }} />
            <div className="w-12 h-px" style={{ background: `linear-gradient(to left, transparent, ${accentColor})` }} />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Our Awards & Recognition
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Celebrating our commitment to excellence and the achievements of our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full transition-all duration-300 hover:transform hover:-translate-y-2"
                style={{ ['--hover-border-color' as string]: `color-mix(in srgb, ${accentColor} 50%, transparent)` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <award.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 transition-colors" style={{ ['--hover-color' as string]: accentColor }}>
                  {award.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
