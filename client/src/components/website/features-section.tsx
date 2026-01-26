import type { FeaturesProps, School } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Trophy,
  Globe,
  Microscope,
  Music,
  Palette,
  Code,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  book: BookOpen,
  users: Users,
  trophy: Trophy,
  globe: Globe,
  science: Microscope,
  music: Music,
  art: Palette,
  technology: Code,
  default: BookOpen,
};

const colorPalette = [
  { bg: "from-blue-500 to-blue-600" },
  { bg: "from-purple-500 to-purple-600" },
  { bg: "from-pink-500 to-pink-600" },
  { bg: "from-green-500 to-green-600" },
  { bg: "from-orange-500 to-orange-600" },
  { bg: "from-cyan-500 to-cyan-600" },
];

interface FeaturesSectionProps {
  props: FeaturesProps;
  school: School;
}

export function FeaturesSection({ props, school }: FeaturesSectionProps) {
  const primaryColor = `var(--theme-primary, ${school.primaryColor})`;
  const secondaryColor = `var(--theme-secondary, ${school.secondaryColor})`;
  const features = props.features || [
    {
      icon: "book",
      title: "Excellence in Academics",
      description: "Rigorous curriculum designed to challenge and inspire students at every level.",
    },
    {
      icon: "users",
      title: "Expert Faculty",
      description: "Dedicated teachers committed to nurturing every student's potential.",
    },
    {
      icon: "trophy",
      title: "Holistic Development",
      description: "Balanced focus on academics, sports, arts, and character building.",
    },
    {
      icon: "globe",
      title: "Global Perspective",
      description: "Preparing students to thrive in an interconnected world.",
    },
    {
      icon: "science",
      title: "Modern Facilities",
      description: "State-of-the-art labs, libraries, and learning spaces.",
    },
    {
      icon: "music",
      title: "Rich Extracurriculars",
      description: "Diverse clubs and activities for every interest and passion.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="features">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-1.5 text-white text-sm font-medium rounded-full mb-4"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
          >
            Why Choose Us
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            data-testid="text-features-heading"
          >
            {props.heading || "What Makes Us Special"}
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            data-testid="text-features-subheading"
          >
            {props.subheading || "Discover the unique advantages of learning with us"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || iconMap.default;
            const colors = colorPalette[index % colorPalette.length];
            return (
              <Card
                key={index}
                className="group hover-elevate bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-visible"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${colors.bg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
