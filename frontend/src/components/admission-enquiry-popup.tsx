import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Course options as requested by the user
const COURSES = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "MCA",
  "BBA",
  "BCA",
  "M.SC",
  "Diploma",
] as const;

// Form Validation Schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  course: z.enum(COURSES, {
    errorMap: () => ({ message: "Please select a valid course" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdmissionEnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger popup open with a 1.5-second delay on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      state: "",
      city: "",
      course: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_ENQUIRY_API_URL;

    // Check if API endpoint is configured
    if (!apiUrl) {
      // Mock/Development Mode fallback
      console.log("Mock Admission Enquiry Submission successful:", data);
      
      // Artificial delay to mimic server response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Enquiry Submitted (Development Mode)!", {
        description: "Data printed to console. Set VITE_ENQUIRY_API_URL in .env to link with Google Sheets.",
        duration: 5000,
      });
      
      setIsSubmitting(false);
      setIsOpen(false);
      form.reset();
      return;
    }

    try {
      // Send POST request using 'no-cors' mode to bypass Google Apps Script CORS/Redirect blocks
      await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      // Since we use no-cors, the response is opaque (empty) but the request was sent successfully
      toast.success("Thank you for your enquiry!", {
        description: "Our admission counselor will contact you shortly.",
      });
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Enquiry submission error:", error);
      toast.error("Submission failed", {
        description: error.message || "Please check your network connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-card border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl max-w-lg w-[95%] p-0 overflow-hidden md:max-w-md">
        {/* Colorful Gradient Header */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-academic-navy p-6 text-white text-center relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-1">
            Admission Enquiry
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm">
            Fill in your details below. Our counselor will reach out to you.
          </DialogDescription>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto scrollbar-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground/90">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="bg-background/50 border-input/60 focus:bg-background transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground/90">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="10-digit phone no."
                          className="bg-background/50 border-input/60 focus:bg-background transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground/90">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          className="bg-background/50 border-input/60 focus:bg-background transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State Field */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground/90">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Odisha"
                          className="bg-background/50 border-input/60 focus:bg-background transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* City Field */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground/90">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Bhubaneswar"
                          className="bg-background/50 border-input/60 focus:bg-background transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Course Selection */}
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground/90">
                      Select Course
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-input/60 focus:bg-background transition-all">
                          <SelectValue placeholder="Choose a course interested in" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] z-[60]">
                        {COURSES.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-primary to-academic-navy hover:from-primary/90 hover:to-academic-navy/90 text-white font-semibold shadow-md py-5 rounded-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Enquiry...
                  </>
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
