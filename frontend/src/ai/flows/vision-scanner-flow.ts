'use server';

import { getGroqClient } from '../groq';
import { z } from 'zod';

const VisionOutputSchema = z.object({
  merchant: z.string(),
  amount: z.number(),
  currency: z.string(),
  category: z.string(),
  date: z.string()
});

export type VisionScannerOutput = z.infer<typeof VisionOutputSchema>;

export async function processReceiptImage(base64Image: string): Promise<VisionScannerOutput> {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "llama-3.2-90b-vision-instruct",
    messages: [
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Analyze this receipt and extract the details in JSON format only. Use exactly these keys: merchant, amount (number), currency (symbol like ₹ or $), category, date (YYYY-MM-DD)." 
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = VisionOutputSchema.parse(JSON.parse(raw));
  return parsed;
}
