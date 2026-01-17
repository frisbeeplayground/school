import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import type { Lead } from "@shared/schema";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSave: (data: Partial<Lead>) => void;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  gradeInterest: string;
  message: string;
  notes: string;
}

export function LeadDialog({ open, onOpenChange, lead, onSave }: LeadDialogProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<LeadFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      source: "website",
      status: "new",
      gradeInterest: "",
      message: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone || "",
        source: lead.source,
        status: lead.status,
        gradeInterest: lead.gradeInterest || "",
        message: lead.message || "",
        notes: lead.notes || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        source: "website",
        status: "new",
        gradeInterest: "",
        message: "",
        notes: "",
      });
    }
  }, [lead, reset]);

  const onSubmit = (data: LeadFormData) => {
    onSave({
      ...data,
      id: lead?.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lead ? "Edit Lead" : "Add New Lead"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: true })}
                placeholder="John"
                data-testid="input-lead-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: true })}
                placeholder="Doe"
                data-testid="input-lead-last-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="john@example.com"
                data-testid="input-lead-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                data-testid="input-lead-phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={watch("source")}
                onValueChange={(value) => setValue("source", value)}
              >
                <SelectTrigger data-testid="select-lead-source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger data-testid="select-lead-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeInterest">Grade/Program Interest</Label>
            <Input
              id="gradeInterest"
              {...register("gradeInterest")}
              placeholder="e.g., Grade 5, High School, Pre-K"
              data-testid="input-lead-grade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Inquiry Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="What the lead inquired about..."
              className="min-h-[80px]"
              data-testid="textarea-lead-message"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add private notes about this lead..."
              className="min-h-[80px]"
              data-testid="textarea-lead-notes"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-lead">
              {lead ? "Save Changes" : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
