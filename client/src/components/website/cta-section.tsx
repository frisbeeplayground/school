import type { CTAProps, School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

interface CTASectionProps {
  props: CTAProps;
  school: School;
}

export function CTASection({ props, school }: CTASectionProps) {
  return (
    <section className="py-20" id="cta">
      <div className="container mx-auto px-4">
        <div
          className="rounded-2xl p-12 md:p-16 text-center text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h2
              className="font-serif text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-cta-heading"
            >
              {props.heading || "Ready to Join Our Community?"}
            </h2>
            <p
              className="text-white/90 text-lg max-w-2xl mx-auto mb-8"
              data-testid="text-cta-description"
            >
              {props.description ||
                "Take the first step towards an exceptional education. Schedule a visit or apply now to secure your child's future."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-white text-gray-900 hover:bg-gray-100 min-w-[160px]"
                asChild
                data-testid="button-cta-primary"
              >
                <a href={props.buttonLink || "#apply"}>
                  {props.buttonText || "Apply Now"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm min-w-[160px]"
                data-testid="button-cta-secondary"
              >
                <Phone className="h-4 w-4" />
                Schedule Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
