import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { WebsiteHeader } from "@/components/website/website-header";
import { HeroSection } from "@/components/website/hero-section";
import { FeaturesSection } from "@/components/website/features-section";
import { AboutSection } from "@/components/website/about-section";
import { StatsSection } from "@/components/website/stats-section";
import { NoticesSection } from "@/components/website/notices-section";
import { CTASection } from "@/components/website/cta-section";
import { WebsiteFooter } from "@/components/website/website-footer";
import type {
  School,
  PageSection,
  Notice,
  HeroProps,
  FeaturesProps,
  AboutProps,
  StatsProps,
  CTAProps,
} from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function SchoolWebsite() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "springfield";
  const isPreview = window.location.pathname.includes("/preview");

  const { data: school, isLoading: schoolLoading } = useQuery<School>({
    queryKey: [`/api/public/school/${slug}`],
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery<
    PageSection[]
  >({
    queryKey: [`/api/public/sections/${slug}`],
    enabled: !!school,
  });

  const { data: notices = [], isLoading: noticesLoading } = useQuery<Notice[]>({
    queryKey: [`/api/public/notices/${slug}`],
    enabled: !!school,
  });

  const isLoading = schoolLoading || sectionsLoading || noticesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading website...</p>
        </div>
      </div>
    );
  }

  const defaultSchool: School = {
    id: "1",
    name: "Springfield Academy",
    slug: "springfield",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
  };

  const displaySchool = school || defaultSchool;

  const heroSection = sections.find(
    (s) => s.type === "hero" && s.enabled
  );
  const featuresSection = sections.find(
    (s) => s.type === "features" && s.enabled
  );
  const aboutSection = sections.find(
    (s) => s.type === "about" && s.enabled
  );
  const statsSection = sections.find(
    (s) => s.type === "stats" && s.enabled
  );
  const ctaSection = sections.find(
    (s) => s.type === "cta" && s.enabled
  );

  const publishedNotices = notices.filter((n) => n.status === "published");

  return (
    <div className="min-h-screen bg-white">
      <WebsiteHeader school={displaySchool} isPreview={isPreview} />

      <main>
        {heroSection ? (
          <HeroSection
            props={heroSection.props as HeroProps}
            school={displaySchool}
          />
        ) : (
          <HeroSection
            props={{
              title: `Welcome to ${displaySchool.name}`,
              subtitle:
                "Empowering minds, shaping futures, inspiring excellence in every student",
              ctaText: "Apply Now",
              ctaLink: "#admissions",
            }}
            school={displaySchool}
          />
        )}

        {featuresSection ? (
          <FeaturesSection
            props={featuresSection.props as FeaturesProps}
            school={displaySchool}
          />
        ) : (
          <FeaturesSection
            props={{
              heading: "Why Choose Us",
              subheading: "Discover what makes our school exceptional",
              features: [],
            }}
            school={displaySchool}
          />
        )}

        {aboutSection ? (
          <AboutSection
            props={aboutSection.props as AboutProps}
            school={displaySchool}
          />
        ) : (
          <AboutSection
            props={{
              heading: "A Legacy of Excellence",
              content:
                "For over five decades, we have been committed to providing exceptional education that prepares students for success in life.",
            }}
            school={displaySchool}
          />
        )}

        {statsSection ? (
          <StatsSection
            props={statsSection.props as StatsProps}
            school={displaySchool}
          />
        ) : (
          <StatsSection
            props={{
              heading: "Our Achievements",
              stats: [],
            }}
            school={displaySchool}
          />
        )}

        <NoticesSection notices={publishedNotices} school={displaySchool} />

        {ctaSection ? (
          <CTASection
            props={ctaSection.props as CTAProps}
            school={displaySchool}
          />
        ) : (
          <CTASection
            props={{
              heading: "Ready to Join Our Community?",
              description:
                "Take the first step towards an exceptional education. Schedule a visit or apply now.",
              buttonText: "Apply Now",
              buttonLink: "#apply",
            }}
            school={displaySchool}
          />
        )}
      </main>

      <WebsiteFooter school={displaySchool} />
    </div>
  );
}
