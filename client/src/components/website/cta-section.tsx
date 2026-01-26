import type { CTAProps, School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Sparkles, GraduationCap } from "lucide-react";

interface CTASectionProps {
  props: CTAProps;
  school: School;
}

export function CTASection({ props, school }: CTASectionProps) {
  const primaryColor = `var(--theme-primary, ${school.primaryColor})`;
  const secondaryColor = `var(--theme-secondary, ${school.secondaryColor})`;

  return (
    <section className="py-24" id="cta">
      <div className="container mx-auto px-4">
        <div
          className="rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, #7c3aed 100%)`,
          }}
        >
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
            <div className="absolute top-20 right-1/4 animate-spin" style={{ animationDuration: "20s" }}>
              <Sparkles className="w-8 h-8 text-yellow-300 opacity-50" />
            </div>
            <div className="absolute bottom-20 left-1/3 animate-pulse">
              <GraduationCap className="w-10 h-10 text-white opacity-20" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Admissions Open 2026</span>
            </div>
            
            <h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              data-testid="text-cta-heading"
            >
              {props.heading || "Ready to Join Our Community?"}
            </h2>
            <p
              className="text-white/90 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              data-testid="text-cta-description"
            >
              {props.description ||
                "Take the first step towards an exceptional education. Schedule a visit or apply now to secure your child's future."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-white text-gray-900 hover:bg-gray-100 min-w-[200px] h-14 text-lg shadow-lg"
                asChild
                data-testid="button-cta-primary"
              >
                <a href={props.buttonLink || "#apply"}>
                  {props.buttonText || "Apply Now"}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm min-w-[200px] h-14 text-lg"
                data-testid="button-cta-secondary"
              >
                <Phone className="h-5 w-5" />
                Schedule Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
