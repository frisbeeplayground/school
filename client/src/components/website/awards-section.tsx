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

export function AwardsSection({}: AwardsSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border border-yellow-400 rounded-full" />
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-yellow-400 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-yellow-400 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-yellow-400" />
            <Award className="w-8 h-8 text-yellow-400" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-yellow-400" />
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
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <award.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
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
