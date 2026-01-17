import type { AboutProps, School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface AboutSectionProps {
  props: AboutProps;
  school: School;
}

const highlights = [
  "50+ Years of Excellence",
  "95% Graduate Success Rate",
  "Award-Winning Faculty",
  "Modern Campus Facilities",
];

export function AboutSection({ props, school }: AboutSectionProps) {
  return (
    <section className="py-20" id="about">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span
              className="inline-block text-sm font-semibold mb-4 px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${school.primaryColor}15`,
                color: school.primaryColor,
              }}
            >
              About Our School
            </span>
            <h2
              className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              data-testid="text-about-heading"
            >
              {props.heading || "A Legacy of Excellence"}
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-6"
              data-testid="text-about-content"
            >
              {props.content ||
                "For over five decades, we have been committed to providing exceptional education that prepares students for success in life. Our holistic approach combines rigorous academics with character development, creative expression, and physical fitness."}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-5 w-5 shrink-0"
                    style={{ color: school.primaryColor }}
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <Button
              className="gap-2"
              style={{ backgroundColor: school.primaryColor }}
              data-testid="button-learn-more"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div
              className="aspect-[4/3] rounded-lg overflow-hidden"
              style={{
                background: props.image
                  ? `url(${props.image}) center/cover`
                  : `linear-gradient(135deg, ${school.primaryColor}40 0%, ${school.secondaryColor}40 100%)`,
              }}
            >
              {!props.image && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${school.primaryColor}20` }}
                    >
                      <span
                        className="text-3xl font-bold"
                        style={{ color: school.primaryColor }}
                      >
                        50+
                      </span>
                    </div>
                    <p className="font-semibold">Years of Excellence</p>
                  </div>
                </div>
              )}
            </div>
            <div
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-lg opacity-20"
              style={{ backgroundColor: school.primaryColor }}
            />
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-lg opacity-20"
              style={{ backgroundColor: school.secondaryColor }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
