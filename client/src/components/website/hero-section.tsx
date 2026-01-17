import { Button } from "@/components/ui/button";
import type { HeroProps, School } from "@shared/schema";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";

interface HeroSectionProps {
  props: HeroProps;
  school: School;
}

export function HeroSection({ props, school }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: props.backgroundImage
            ? `url(${props.backgroundImage})`
            : `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 50%, #7c3aed 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-bounce"
          style={{ backgroundColor: school.secondaryColor, animationDuration: "4s" }}
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-30 animate-pulse"
          style={{ backgroundColor: "#fbbf24" }}
        />
        <div
          className="absolute bottom-40 left-20 w-12 h-12 rounded-full opacity-25 animate-spin"
          style={{ backgroundColor: "#f472b6", animationDuration: "6s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full opacity-20 animate-ping"
          style={{ backgroundColor: "#34d399", animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full opacity-15 animate-bounce"
          style={{ backgroundColor: school.primaryColor, animationDuration: "7s" }}
        />
        
        <div className="absolute top-1/4 left-1/4 animate-spin" style={{ animationDuration: "20s" }}>
          <Star className="w-6 h-6 text-yellow-400 opacity-40" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-pulse">
          <Sparkles className="w-8 h-8 text-white opacity-30" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white py-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Where Dreams Take Flight</span>
        </div>
        
        <h1
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight max-w-4xl mx-auto"
          data-testid="text-hero-title"
        >
          {props.title || "Welcome to Our School"}
        </h1>
        
        <p
          className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          data-testid="text-hero-subtitle"
        >
          {props.subtitle || "Empowering minds, shaping futures, inspiring excellence"}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 min-w-[180px] h-14 text-lg shadow-lg shadow-yellow-500/25 border-0"
            asChild
            data-testid="button-hero-cta"
          >
            <a href={props.ctaLink || "#admissions"}>
              {props.ctaText || "Apply Now"}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm min-w-[180px] h-14 text-lg"
            data-testid="button-hero-tour"
          >
            <Play className="h-5 w-5" />
            Virtual Tour
          </Button>
        </div>
        
        <div className="flex justify-center gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">2500+</div>
            <div className="text-sm text-white/70">Happy Students</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">150+</div>
            <div className="text-sm text-white/70">Expert Teachers</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">50+</div>
            <div className="text-sm text-white/70">Years Legacy</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
