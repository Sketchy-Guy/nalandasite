import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const DirectorMessage = () => {
  const { data: directorMessage } = useQuery({
    queryKey: ['director-message'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leadership_messages')
        .select('*')
        .eq('position', 'director')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Director's Message
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Academic Leadership and Innovation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Director's Photo and Details */}
              <div className="md:flex">
                {directorMessage?.photo_url && (
                  <div className="md:w-1/3 bg-gradient-to-br from-accent/10 to-accent/5 p-8 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg">
                      <img 
                        src={directorMessage.photo_url} 
                        alt={directorMessage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {directorMessage.name}
                      </h3>
                      <p className="text-accent font-medium mb-2">
                        {directorMessage.designation || "Director"}
                      </p>
                      {directorMessage.qualifications && (
                        <p className="text-sm text-muted-foreground">
                          {directorMessage.qualifications}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Message Content */}
                <div className="md:w-2/3 p-8">
                  <div className="mb-6">
                    <Quote className="h-12 w-12 text-accent opacity-50 mb-4" />
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                      A Message from the Director
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {directorMessage?.message || `
                        Welcome to the National Institute of Technology Nalanda, where academic excellence 
                        meets innovation and research. As Director of this prestigious institution, I am 
                        honored to lead a community of dedicated educators, brilliant researchers, and 
                        ambitious students who collectively strive for excellence in every endeavor.

                        Our institute has established itself as a center of academic excellence, fostering 
                        an environment where knowledge creation and dissemination go hand in hand. We believe 
                        in nurturing not just technical competence but also critical thinking, creativity, 
                        and leadership skills that are essential for success in today's rapidly evolving world.

                        Research and innovation form the backbone of our academic philosophy. Our faculty and 
                        students are engaged in cutting-edge research projects that address some of the most 
                        pressing challenges of our time. From sustainable technology development to advanced 
                        engineering solutions, our research initiatives contribute significantly to the 
                        advancement of knowledge and technology.

                        We take pride in our strong industry partnerships and our graduates' exceptional 
                        placement records. Our alumni have made their mark in leading organizations worldwide, 
                        serving as ambassadors of the quality education and values instilled at NIT Nalanda.

                        I invite you to explore the opportunities that await you at our institution and 
                        join us in our mission to create a better tomorrow through education and innovation.
                      `}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-muted-foreground italic">
                      "Innovation distinguishes between a leader and a follower."
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

export default DirectorMessage;