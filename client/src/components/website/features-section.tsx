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

interface FeaturesSectionProps {
  props: FeaturesProps;
  school: School;
}

export function FeaturesSection({ props, school }: FeaturesSectionProps) {
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
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-features-heading"
          >
            {props.heading || "Why Choose Us"}
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            data-testid="text-features-subheading"
          >
            {props.subheading || "Discover what makes our school exceptional"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || iconMap.default;
            return (
              <Card
                key={index}
                className="hover-elevate bg-white border-0 shadow-sm"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${school.primaryColor}15` }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: school.primaryColor }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
