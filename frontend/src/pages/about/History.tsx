import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const History = () => {
  const { data: historyContent } = useQuery({
    queryKey: ['history-page'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about_pages')
        .select('*')
        .eq('page_type', 'history')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  const milestones = [
    {
      year: "2007",
      title: "Establishment of NIT Nalanda",
      description: "Founded as a premier technical institution with the vision of excellence in engineering education."
    },
    {
      year: "2010",
      title: "First Batch of Graduates",
      description: "Celebrated the graduation of our first batch of engineers, marking the beginning of our alumni network."
    },
    {
      year: "2015",
      title: "Research Excellence",
      description: "Established multiple research centers and initiated industry collaborations for advanced research projects."
    },
    {
      year: "2018",
      title: "NAAC A+ Accreditation",
      description: "Achieved the prestigious NAAC A+ accreditation, recognizing our commitment to quality education."
    },
    {
      year: "2020",
      title: "NBA Accreditation",
      description: "Received NBA accreditation for multiple engineering programs, ensuring international standards."
    },
    {
      year: "2022",
      title: "Atal Incubation Center",
      description: "Selected as Atal Incubation Center, fostering startup ecosystem and entrepreneurship."
    },
    {
      year: "2023",
      title: "SIRO Recognition",
      description: "Received SIRO (Scientific and Industrial Research Organization) recognition for research excellence."
    },
    {
      year: "2024",
      title: "17 Years of Excellence",
      description: "Celebrating 17 years of academic excellence and contribution to technical education."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our History
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              17 Years of Excellence in Technical Education
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Introduction */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Our Journey Through Time</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                {historyContent?.content || `
                  Since its establishment in 2007, the National Institute of Technology Nalanda has been 
                  at the forefront of technical education and research. Our journey reflects a commitment 
                  to excellence, innovation, and the development of future leaders in technology and engineering.
                `}
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-0.5"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative mb-8 md:mb-12">
                <div className={`md:flex md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-2 md:-translate-x-2 z-10">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full absolute top-1 left-1"></div>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl font-bold text-primary mr-3">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-2/12"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legacy Statement */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary">Building Tomorrow's Leaders</h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  As we continue our journey into the future, NIT Nalanda remains committed to its founding 
                  principles of excellence, innovation, and service to society. Our rich history serves as 
                  the foundation for even greater achievements in the years to come.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;