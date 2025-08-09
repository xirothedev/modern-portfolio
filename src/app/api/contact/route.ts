import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
	email: z.email("Please enter a valid email address"),
	subject: z
		.string()
		.min(5, "Subject must be at least 5 characters")
		.max(100, "Subject must be less than 100 characters"),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(1000, "Message must be less than 1000 characters"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body with Zod
		const validationResult = contactFormSchema.safeParse(body);

		if (!validationResult.success) {
			const errors = validationResult.error.issues
				.map((err) => `${err.path.join(".")}: ${err.message}`)
				.join(", ");
			return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 });
		}

		const { name, email, subject, message } = validationResult.data;

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: "Contact Form <onboarding@resend.dev>",
			to: ["lethanhtrung.trungle@gmail.com"],
			subject: `Contact Form: ${subject}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">This email was sent from your portfolio contact form.</p>
            <p style="margin: 5px 0 0 0;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
			replyTo: email, // This allows you to reply directly to the sender
		});

		if (error) {
			console.error("Resend error:", error);
			return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
		}

		return NextResponse.json({ message: "Email sent successfully", id: data?.id }, { status: 200 });
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
