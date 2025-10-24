import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosisId, imageUrl, problemDescription } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI with vision capabilities for image analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a veterinary dermatology expert AI. Analyze dog skin condition images and provide:
1. Disease name (most likely condition)
2. Severity level (mild, moderate, or severe)
3. Whether veterinary consultation is needed (true/false)
4. Reason for consultation if needed
5. Cure suggestions (professional treatment options)
6. Home remedies (safe at-home care steps)

Provide your response in a structured format.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Problem description: ${problemDescription}\n\nPlease analyze this dog's skin condition and provide a detailed diagnosis.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI service requires payment. Please add credits to your workspace.');
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse AI response to extract structured data
    const parsedResult = parseAIResponse(aiResponse);

    // Update diagnosis in database
    const { error: updateError } = await supabaseClient
      .from('diagnoses')
      .update({
        ai_diagnosis: aiResponse,
        disease_name: parsedResult.disease_name,
        severity: parsedResult.severity,
        should_consult_doctor: parsedResult.should_consult_doctor,
        consultation_reason: parsedResult.consultation_reason,
        cure_suggestions: parsedResult.cure_suggestions,
        home_remedies: parsedResult.home_remedies,
        status: 'completed'
      })
      .eq('id', diagnosisId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-skin-condition:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function parseAIResponse(response: string): any {
  // This is a simple parser - in production, you might want to use JSON output from the AI
  const result: any = {
    disease_name: 'Unknown',
    severity: 'moderate',
    should_consult_doctor: true,
    consultation_reason: '',
    cure_suggestions: '',
    home_remedies: '',
  };

  // Extract disease name
  const diseaseMatch = response.match(/disease[:\s]+([^\n.]+)/i);
  if (diseaseMatch) result.disease_name = diseaseMatch[1].trim();

  // Extract severity
  if (response.toLowerCase().includes('severe')) {
    result.severity = 'severe';
  } else if (response.toLowerCase().includes('mild')) {
    result.severity = 'mild';
  }

  // Check if consultation needed
  result.should_consult_doctor = 
    response.toLowerCase().includes('veterinary') ||
    response.toLowerCase().includes('consult') ||
    result.severity === 'severe';

  // Extract sections
  const consultMatch = response.match(/(?:consultation|veterinary)[:\s]+([^\n]+)/i);
  if (consultMatch) result.consultation_reason = consultMatch[1].trim();

  const cureMatch = response.match(/(?:cure|treatment)[:\s]+([^(\r\n)]+)/i);
  if (cureMatch) result.cure_suggestions = cureMatch[1].trim();

  const homeMatch = response.match(/(?:home\s+remed)[^:]*[:\s]+([^(\r\n)]+)/i);
  if (homeMatch) result.home_remedies = homeMatch[1].trim();

  // If we couldn't parse specific sections, use the full response
  if (!result.cure_suggestions) {
    result.cure_suggestions = 'Please consult with a veterinarian for proper treatment options.';
  }
  if (!result.home_remedies) {
    result.home_remedies = 'Keep the area clean and dry. Monitor for any changes.';
  }
  if (!result.consultation_reason) {
    result.consultation_reason = 'Professional evaluation recommended for accurate diagnosis.';
  }

  return result;
}
