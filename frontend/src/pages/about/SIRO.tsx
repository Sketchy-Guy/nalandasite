import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lightbulb, ExternalLink } from "lucide-react";

const SIRO = () => {
  const { data: siroInfo } = useQuery({
    queryKey: ['siro-recognition'],
    queryFn: async () => {
      const { data } = await supabase
        .from('accreditation_info')
        .select('*')
        .eq('accreditation_type', 'siro')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">SIRO Recognition</h1>
            <p className="text-xl md:text-2xl opacity-90">Scientific and Industrial Research Organization</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-12">
            <CardContent className="p-8 text-center">
              <Lightbulb className="h-16 w-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Research Excellence Recognition</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {siroInfo?.description || `
                  NIT Nalanda has been recognized as a Scientific and Industrial Research Organization (SIRO) 
                  by the Department of Scientific and Industrial Research, Government of India, validating 
                  our commitment to research and innovation.
                `}
              </p>
              {siroInfo?.certificate_url && (
                <Button asChild className="mt-6" size="lg">
                  <a href={siroInfo.certificate_url} target="_blank" rel="noopener noreferrer">
                    View SIRO Certificate <ExternalLink className="h-5 w-5 ml-2" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SIRO;