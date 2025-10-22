import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const ViceChairmanMessage = () => {
  const { data: viceChairmanMessage } = useQuery({
    queryKey: ['vice-chairman-message'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leadership_messages')
        .select('*')
        .eq('position', 'vice_chairman')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vice Chairman's Message
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Commitment to Community and Excellence
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Vice Chairman's Photo and Details */}
              <div className="md:flex">
                {viceChairmanMessage?.photo_url && (
                  <div className="md:w-1/3 bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg">
                      <img 
                        src={viceChairmanMessage.photo_url} 
                        alt={viceChairmanMessage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {viceChairmanMessage.name}
                      </h3>
                      <p className="text-secondary font-medium mb-2">
                        {viceChairmanMessage.designation || "Vice Chairman"}
                      </p>
                      {viceChairmanMessage.qualifications && (
                        <p className="text-sm text-muted-foreground">
                          {viceChairmanMessage.qualifications}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Message Content */}
                <div className="md:w-2/3 p-8">
                  <div className="mb-6">
                    <Quote className="h-12 w-12 text-secondary opacity-50 mb-4" />
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                      A Message from the Vice Chairman
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {viceChairmanMessage?.message || `
                        It gives me immense pleasure to welcome you to the National Institute of Technology Nalanda. 
                        As Vice Chairman, I am deeply committed to ensuring that our institution continues to serve 
                        as a beacon of excellence in technical education while maintaining its strong connection to 
                        the community we serve.

                        Our institute has always believed in the principle of holistic development. We don't just 
                        create engineers; we nurture individuals who understand their responsibility towards society 
                        and are equipped to make meaningful contributions to the world around them.

                        The focus on community service and social consciousness has been a cornerstone of our 
                        institutional philosophy. We encourage our students to engage with local communities, 
                        understand their challenges, and develop solutions that can make a real difference in 
                        people's lives.

                        As we move forward, we remain committed to maintaining the highest standards of education 
                        while ensuring that our graduates are not just technically competent but also socially 
                        responsible citizens who can lead positive change in society.

                        I invite you to be part of this wonderful journey of learning, growth, and service to humanity.
                      `}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-muted-foreground italic">
                      "True education must correspond to the surrounding circumstances or it is not a healthy growth."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViceChairmanMessage;