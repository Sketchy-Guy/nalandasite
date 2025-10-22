import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User } from 'lucide-react';

interface FacultyCardProps {
  faculty: {
    id: string;
    full_name: string;
    email: string;
    designation?: string;
    qualifications?: string;
    research_areas?: string[];
    photo_url?: string;
  };
}

export function FacultyCard({ faculty }: FacultyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Faculty Photo */}
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {faculty.photo_url ? (
              <img 
                src={faculty.photo_url} 
                alt={faculty.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          {/* Faculty Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{faculty.full_name}</h3>
            {faculty.designation && (
              <p className="text-sm text-primary font-medium">{faculty.designation}</p>
            )}
            {faculty.qualifications && (
              <p className="text-sm text-muted-foreground">{faculty.qualifications}</p>
            )}
          </div>

          {/* Research Areas */}
          {faculty.research_areas && faculty.research_areas.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Research Areas:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {faculty.research_areas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {faculty.email && (
            <a 
              href={`mailto:${faculty.email}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}