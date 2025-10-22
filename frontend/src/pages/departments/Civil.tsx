import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Civil Engineering",
  description: "The Department of Civil Engineering is dedicated to education and research in infrastructure development, construction technology, and sustainable engineering solutions.",
  head_name: "Prof. Manoj Kumar Jha",
  contact_email: "civil.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide comprehensive civil engineering education, promote sustainable development practices, and develop engineers capable of building better infrastructure.",
  vision: "To be a leading civil engineering department contributing to infrastructure development and environmental sustainability.",
  facilities: [
    "Structural Engineering Lab",
    "Geotechnical Engineering Lab",
    "Environmental Engineering Lab",
    "Transportation Engineering Lab",
    "Materials Testing Lab",
    "Survey Laboratory"
  ],
  programs_offered: [
    "B.Tech Civil Engineering",
    "M.Tech Civil Engineering",
    "Ph.D. in Civil Engineering",
    "Diploma in Civil Engineering"
  ],
  achievements: [
    "Well-equipped laboratories",
    "Research in sustainable construction",
    "Government project collaborations",
    "Student fieldwork and site visits"
  ],
  location_details: "Engineering Block, 2nd Floor, Room No. 301-320",
  gallery_images: [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function CivilDepartment() {
  return <DepartmentTemplate departmentCode="CIVIL" fallbackData={fallbackData} />;
}