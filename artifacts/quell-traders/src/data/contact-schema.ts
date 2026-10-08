import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  company: z.string().trim().max(150, "Company name is too long.").optional(),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30, "Phone number is too long."),
  interest: z.enum(["TIJ Printing Solutions", "Compressor Spares", "Other"]),
  message: z.string().trim().min(10, "Please add a little more detail.").max(2000, "Message is too long."),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
