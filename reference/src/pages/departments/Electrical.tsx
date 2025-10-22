import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Electrical Engineering",
  description: "The Department of Electrical Engineering focuses on power systems, electronics, control systems, and emerging technologies in electrical and electronic engineering.",
  head_name: "Dr. Kavita Sharma",
  contact_email: "eee.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide excellent education in electrical engineering, conduct impactful research, and develop professionals who can contribute to technological advancement.",
  vision: "To be a center of excellence in electrical engineering education and research, addressing societal needs through innovation.",
  facilities: [
    "Power Systems Laboratory",
    "Electronics & Communication Lab",
    "Control Systems Lab",
    "Electrical Machines Lab",
    "Renewable Energy Lab",
    "High Voltage Lab"
  ],
  programs_offered: [
    "B.Tech Electrical Engineering",
    "M.Tech Electrical Engineering",
    "Ph.D. in Electrical Engineering",
    "Diploma in Electrical Engineering"
  ],
  achievements: [
    "Modern laboratory infrastructure",
    "Research in renewable energy",
    "Industry partnerships",
    "Student achievements in competitions"
  ],
  location_details: "Engineering Block, 1st Floor, Room No. 201-220",
  gallery_images: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581092446248-4efdf17fb23b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function ElectricalDepartment() {
  return <DepartmentTemplate departmentCode="EEE" fallbackData={fallbackData} />;
}