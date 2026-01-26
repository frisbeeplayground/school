import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import type { School } from "@shared/schema";

interface InquiryFormProps {
  school: School;
}

export function InquiryForm({ school }: InquiryFormProps) {
  const primaryColor = `var(--theme-primary, ${school.primaryColor})`;
  const secondaryColor = `var(--theme-secondary, ${school.secondaryColor})`;
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeInterest: "",
    message: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", `/api/public/leads/${school.slug}`, {
        ...data,
        source: "website",
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Inquiry Submitted!",
        description: "We'll get back to you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Please fill required fields",
        description: "First name, last name, and email are required.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">
            Your inquiry has been submitted successfully. Our admissions team will contact you soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Request Information</CardTitle>
        <CardDescription>
          Fill out the form below and our admissions team will get in touch with you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                required
                data-testid="input-inquiry-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                required
                data-testid="input-inquiry-last-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
                required
                data-testid="input-inquiry-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                data-testid="input-inquiry-phone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeInterest">Grade/Program of Interest</Label>
            <Select
              value={formData.gradeInterest}
              onValueChange={(value) => handleChange("gradeInterest", value)}
            >
              <SelectTrigger data-testid="select-inquiry-grade">
                <SelectValue placeholder="Select grade or program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-k">Pre-Kindergarten</SelectItem>
                <SelectItem value="kindergarten">Kindergarten</SelectItem>
                <SelectItem value="elementary">Elementary (Grades 1-5)</SelectItem>
                <SelectItem value="middle">Middle School (Grades 6-8)</SelectItem>
                <SelectItem value="high">High School (Grades 9-12)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Tell us about your child and any questions you have..."
              className="min-h-[100px]"
              data-testid="textarea-inquiry-message"
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={submitMutation.isPending}
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            }}
            data-testid="button-submit-inquiry"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Inquiry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
