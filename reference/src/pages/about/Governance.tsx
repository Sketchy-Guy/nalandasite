import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, GraduationCap, Briefcase } from "lucide-react";

const Governance = () => {
  const { data: governanceData } = useQuery({
    queryKey: ['governance-structure'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about_pages')
        .select('*')
        .eq('page_type', 'governance')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  const governanceStructure = [
    {
      title: "Board of Governors",
      icon: <Building className="h-8 w-8" />,
      description: "The apex body responsible for policy formulation and strategic oversight of the institute.",
      members: [
        "Chairman - Industry Representative",
        "Vice Chairman - Government Nominee", 
        "Director - Ex-officio Member",
        "Government Representatives",
        "Industry Experts",
        "Alumni Representatives"
      ]
    },
    {
      title: "Academic Council",
      icon: <GraduationCap className="h-8 w-8" />,
      description: "Responsible for academic policies, curriculum development, and maintaining academic standards.",
      members: [
        "Director - Chairman",
        "Deans of all Schools",
        "Heads of Departments",
        "Senior Faculty Representatives",
        "Student Representatives",
        "External Academic Experts"
      ]
    },
    {
      title: "Finance Committee",
      icon: <Briefcase className="h-8 w-8" />,
      description: "Oversees financial planning, budgeting, and resource allocation for the institute.",
      members: [
        "Chairman, Board of Governors",
        "Director",
        "Government Finance Representative",
        "External Finance Expert",
        "Registrar - Member Secretary"
      ]
    },
    {
      title: "Research & Development Council",
      icon: <Users className="h-8 w-8" />,
      description: "Guides research activities, innovation initiatives, and industry collaborations.",
      members: [
        "Director - Chairman",
        "Dean Research & Development",
        "Research Faculty Representatives",
        "Industry R&D Experts",
        "Government Research Organization Representatives"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Governance Structure
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Leadership and Administrative Framework
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Introduction */}
          <Card className="mb-12">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Transparent Governance</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                {governanceData?.content || `
                  Our governance structure ensures transparency, accountability, and effective decision-making 
                  across all levels of the institution. We believe in participatory governance that involves 
                  all stakeholders in shaping the future of our institute.
                `}
              </p>
            </CardContent>
          </Card>

          {/* Governance Bodies */}
          <div className="grid gap-8">
            {governanceStructure.map((body, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b">
                    <div className="flex items-center">
                      <div className="text-primary mr-4">
                        {body.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {body.title}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          {body.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-4 text-foreground">
                      Composition:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {body.members.map((member, memberIndex) => (
                        <div key={memberIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-muted-foreground">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Organizational Hierarchy */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Organizational Hierarchy</h3>
              
              <div className="max-w-4xl mx-auto">
                {/* Top Level */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold">
                    Board of Governors
                  </div>
                </div>
                
                {/* Second Level */}
                <div className="flex justify-center mb-8">
                  <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold">
                    Director
                  </div>
                </div>
                
                {/* Third Level */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium text-center">
                    Registrar
                  </div>
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium text-center">
                    Dean Academic Affairs
                  </div>
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium text-center">
                    Dean Student Affairs
                  </div>
                </div>
                
                {/* Fourth Level */}
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="bg-muted text-muted-foreground px-3 py-2 rounded font-medium text-center text-sm">
                    Heads of Departments
                  </div>
                  <div className="bg-muted text-muted-foreground px-3 py-2 rounded font-medium text-center text-sm">
                    Administrative Officers
                  </div>
                  <div className="bg-muted text-muted-foreground px-3 py-2 rounded font-medium text-center text-sm">
                    Faculty Members
                  </div>
                  <div className="bg-muted text-muted-foreground px-3 py-2 rounded font-medium text-center text-sm">
                    Support Staff
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transparency Measures */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Transparency & Accountability</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Transparency Measures</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Regular publication of meeting minutes
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Open access to institutional policies
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Annual financial reports
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Grievance redressal mechanism
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Stakeholder Participation</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Student representation in committees
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Faculty participation in decision-making
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Alumni advisory committee
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      Industry expert consultation
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Governance;