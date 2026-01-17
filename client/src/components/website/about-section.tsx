import type { AboutProps, School } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Heart, Star, BookOpen, Users } from "lucide-react";

interface AboutSectionProps {
  props: AboutProps;
  school: School;
}

const highlights = [
  { icon: Star, text: "50+ Years of Excellence" },
  { icon: CheckCircle2, text: "95% Graduate Success Rate" },
  { icon: Users, text: "Award-Winning Faculty" },
  { icon: BookOpen, text: "Modern Campus Facilities" },
];

export function AboutSection({ props, school }: AboutSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden" id="about">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-blue-100 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2" />
      
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-full px-4 py-1.5 mb-6">
              <Heart className="w-4 h-4" />
              About Our School
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              data-testid="text-about-heading"
            >
              {props.heading || "A Legacy of Excellence & Care"}
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              data-testid="text-about-content"
            >
              {props.content ||
                "For over five decades, we have been committed to providing exceptional education that prepares students for success in life. Our holistic approach combines rigorous academics with character development, creative expression, and physical fitness."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${school.primaryColor}15` }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: school.primaryColor }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
            
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
              data-testid="button-learn-more"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="relative">
              <div
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: props.image
                    ? `url(${props.image}) center/cover`
                    : `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 50%, #7c3aed 100%)`,
                }}
              >
                {!props.image && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20 backdrop-blur-sm animate-pulse">
                        <span className="text-4xl font-bold">50+</span>
                      </div>
                      <p className="font-semibold text-xl">Years of Excellence</p>
                      <p className="text-white/80 mt-2">Shaping Future Leaders</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2500+</div>
                    <div className="text-sm text-gray-500">Happy Students</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                    <div className="text-sm text-gray-500">Parent Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
