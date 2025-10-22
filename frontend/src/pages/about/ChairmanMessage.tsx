import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const ChairmanMessage = () => {
  const { data: chairmanMessage } = useQuery({
    queryKey: ['chairman-message'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leadership_messages')
        .select('*')
        .eq('position', 'chairman')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chairman's Message
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Leadership Vision for Excellence
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Chairman's Photo and Details */}
              <div className="md:flex">
                {chairmanMessage?.photo_url && (
                  <div className="md:w-1/3 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg">
                      <img 
                        src={chairmanMessage.photo_url} 
                        alt={chairmanMessage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {chairmanMessage.name}
                      </h3>
                      <p className="text-primary font-medium mb-2">
                        {chairmanMessage.designation || "Chairman"}
                      </p>
                      {chairmanMessage.qualifications && (
                        <p className="text-sm text-muted-foreground">
                          {chairmanMessage.qualifications}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Message Content */}
                <div className="md:w-2/3 p-8">
                  <div className="mb-6">
                    <Quote className="h-12 w-12 text-primary opacity-50 mb-4" />
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                      A Message from the Chairman
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {chairmanMessage?.message || `
                        Welcome to the National Institute of Technology Nalanda. As Chairman of this esteemed institution, 
                        I am proud to be part of an organization that has consistently strived for excellence in technical 
                        education and research.

                        Our institute stands as a testament to the power of vision, dedication, and unwavering commitment 
                        to quality education. We have always believed that education is not just about imparting knowledge, 
                        but about shaping minds that can think critically, innovate fearlessly, and contribute meaningfully 
                        to society.

                        At NIT Nalanda, we foster an environment where students are encouraged to explore, experiment, and 
                        excel. Our faculty members are not just teachers but mentors who guide our students towards becoming 
                        competent professionals and responsible citizens.

                        As we continue our journey towards excellence, we remain committed to our core values of integrity, 
                        innovation, and inclusive growth. I am confident that with the collective efforts of our faculty, 
                        staff, and students, we will continue to scale new heights of success.
                      `}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-muted-foreground italic">
                      "Education is the most powerful weapon which you can use to change the world."
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

export default ChairmanMessage;