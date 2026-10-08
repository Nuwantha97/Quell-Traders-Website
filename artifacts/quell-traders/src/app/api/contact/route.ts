import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formCopy } from "@/config/site";
import { contactSchema } from "@/data/contact-schema";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: formCopy.badRequest }, { status: 400 });
  }

  if (body && typeof body === "object" && "website" in body && typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ message: formCopy.success });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: formCopy.validationError, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const requiredEnv = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "CONTACT_TO_EMAIL"] as const;
  const missingEnv = requiredEnv.filter((key) => !process.env[key]?.trim());
  if (missingEnv.length > 0) {
    console.error("Contact form email delivery is not configured. Missing required environment variables:", missingEnv.join(", "));
    return NextResponse.json(
      { message: formCopy.emailNotConfigured },
      { status: 503 },
    );
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("Contact form email delivery is not configured. SMTP_PORT must be a valid port number.");
    return NextResponse.json(
      { message: formCopy.emailUnavailable },
      { status: 503 },
    );
  }

  const { name, company, email, phone, interest, message } = parsed.data;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const emailFields = [
      [formCopy.emailFieldLabels.name, name],
      [formCopy.emailFieldLabels.company, company || formCopy.emailNotProvided],
      [formCopy.emailFieldLabels.email, email],
      [formCopy.emailFieldLabels.phone, phone],
      [formCopy.emailFieldLabels.interest, interest],
    ];
    const safeMessage = escapeHtml(message);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `${formCopy.emailSubject}: ${interest}`,
      text: [
        ...emailFields.map(([label, value]) => `${label}: ${value}`),
        "",
        `${formCopy.emailFieldLabels.message}:`,
        message,
      ].join("\n"),
      html: `<h2>${escapeHtml(formCopy.emailSubject)}: ${escapeHtml(interest)}</h2>${emailFields.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")}<p><strong>${escapeHtml(formCopy.emailFieldLabels.message)}:</strong></p><p>${safeMessage.replace(/\n/g, "<br>")}</p>`,
    });

    return NextResponse.json({ message: formCopy.success });
  } catch (error) {
    console.error("Contact form email delivery failed.", error);
    return NextResponse.json(
      { message: formCopy.deliveryFailed },
      { status: 502 },
    );
  }
}
