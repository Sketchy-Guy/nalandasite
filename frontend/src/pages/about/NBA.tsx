import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, GraduationCap } from "lucide-react";

const NBA = () => {

  const accreditedPrograms = [
    {
      program: "Mechanical Engineering",
      accreditationDate: "2021",
      validUpto: "2024",
      status: "Accredited"
    },
    {
      program: "Electrical & Electronics Engineering",
      accreditationDate: "2022",
      validUpto: "2025",
      status: "Accredited"
    }
  ];

  const nbaOutcomes = [
    {
      outcome: "Engineering Knowledge",
      description: "Apply knowledge of mathematics, science, engineering fundamentals to solve complex engineering problems"
    },
    {
      outcome: "Problem Analysis",
      description: "Identify, formulate, research literature, and analyze complex engineering problems"
    },
    {
      outcome: "Design/Development of Solutions",
      description: "Design solutions for complex engineering problems with appropriate consideration for public health and safety"
    },
    {
      outcome: "Conduct Investigations",
      description: "Use research-based knowledge including design of experiments, analysis and interpretation of data"
    },
    {
      outcome: "Modern Tool Usage",
      description: "Create, select, and apply appropriate techniques, resources, and modern engineering tools"
    },
    {
      outcome: "The Engineer and Society",
      description: "Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-secondary-foreground/20 p-4 rounded-full">
                <Award className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NBA Accreditation
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              National Board of Accreditation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Overview */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <GraduationCap className="h-16 w-16 text-secondary mx-auto mb-6" />
                <h2 className="text-3xl font-bold">Program Accreditation Excellence</h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-center">
                  The National Board of Accreditation (NBA) has recognized multiple engineering programs at
                  NIT Nalanda for meeting international standards of engineering education. This accreditation
                  ensures our graduates are globally competitive and industry-ready.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Accredited Programs */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">NBA Accredited Programs</h3>

            <div className="grid gap-4">
              {accreditedPrograms.map((program, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          {program.program}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Accredited: {program.accreditationDate}</span>
                          <span>Valid till: {program.validUpto}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-secondary text-secondary-foreground">
                          {program.status}
                        </Badge>
                        <CheckCircle className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Program Learning Outcomes</h3>
            <p className="text-center text-muted-foreground mb-8">
              NBA accreditation ensures our programs achieve specific learning outcomes that prepare students for professional practice.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {nbaOutcomes.map((outcome, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-secondary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-2">
                          {outcome.outcome}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {outcome.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits and Impact */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Benefits for Students</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Global recognition of engineering degree</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Enhanced career opportunities worldwide</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Industry-relevant curriculum and training</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Access to international higher education</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Professional engineering licensing eligibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Institutional Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Enhanced institutional reputation and credibility</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Better industry partnerships and placements</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Access to international collaborations</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Continuous curriculum improvement process</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Alumni network strengthening globally</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quality Assurance Process */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">NBA Quality Assurance Process</h3>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Self Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive evaluation of program standards and outcomes
                  </p>
                </div>

                <div>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Expert Visit</h4>
                  <p className="text-sm text-muted-foreground">
                    On-site evaluation by NBA appointed expert committee
                  </p>
                </div>

                <div>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed analysis of curriculum, faculty, and infrastructure
                  </p>
                </div>

                <div>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary font-bold">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Accreditation</h4>
                  <p className="text-sm text-muted-foreground">
                    Grant of NBA accreditation status for qualifying programs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
};

export default NBA;