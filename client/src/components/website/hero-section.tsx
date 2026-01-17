import { Button } from "@/components/ui/button";
import type { HeroProps, School } from "@shared/schema";
import { ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  props: HeroProps;
  school: School;
}

export function HeroSection({ props, school }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: props.backgroundImage
            ? `url(${props.backgroundImage})`
            : `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 container mx-auto px-4 text-center text-white py-20">
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto"
          data-testid="text-hero-title"
        >
          {props.title || "Welcome to Our School"}
        </h1>
        <p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          {props.subtitle || "Empowering minds, shaping futures, inspiring excellence"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="gap-2 bg-white text-gray-900 hover:bg-gray-100 min-w-[160px]"
            asChild
            data-testid="button-hero-cta"
          >
            <a href={props.ctaLink || "#admissions"}>
              {props.ctaText || "Apply Now"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm min-w-[160px]"
            data-testid="button-hero-tour"
          >
            <Play className="h-4 w-4" />
            Virtual Tour
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
