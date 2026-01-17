import type { StatsProps, School } from "@shared/schema";

interface StatsSectionProps {
  props: StatsProps;
  school: School;
}

export function StatsSection({ props, school }: StatsSectionProps) {
  const stats = props.stats || [
    { value: "2500+", label: "Students" },
    { value: "150+", label: "Expert Faculty" },
    { value: "50+", label: "Years of Excellence" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <section
      className="py-16"
      style={{
        background: `linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%)`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            data-testid="text-stats-heading"
          >
            {props.heading || "Our Achievements"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/80 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
