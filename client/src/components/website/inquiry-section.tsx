import type { School } from "@shared/schema";
import { InquiryForm } from "./inquiry-form";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

interface InquirySectionProps {
  school: School;
}

export function InquirySection({ school }: InquirySectionProps) {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full px-4 py-1.5 mb-4">
            <MessageCircle className="w-4 h-4" />
            Get in Touch
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interested in Joining Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Submit an inquiry and our admissions team will reach out to answer your questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                We'd Love to Hear From You
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're interested in enrollment, have questions about our programs, 
                or would like to schedule a campus visit, our friendly admissions team is here to help.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <Phone className="w-5 h-5" style={{ color: school.primaryColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Call Us</h4>
                  <p className="text-gray-600 text-sm">{school.operatingHours || "Mon-Fri 8am to 5pm"}</p>
                  <a href={`tel:${school.phone || "+1555000000"}`} className="text-primary font-medium hover:underline">
                    {school.phone || "+1 (555) 000-0000"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <Mail className="w-5 h-5" style={{ color: school.primaryColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Us</h4>
                  <p className="text-gray-600 text-sm">We'll respond within 24 hours</p>
                  <a href={`mailto:${school.email || `admissions@${school.slug}.edu`}`} className="text-primary font-medium hover:underline">
                    {school.email || `admissions@${school.slug}.edu`}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <MapPin className="w-5 h-5" style={{ color: school.primaryColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600 text-sm">Campus tours available</p>
                  <p className="text-gray-800">{school.address || "123 Education Lane, Springfield"}</p>
                </div>
              </div>
            </div>
          </div>

          <InquiryForm school={school} />
        </div>
      </div>
    </section>
  );
}
