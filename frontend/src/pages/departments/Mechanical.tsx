import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Mechanical Engineering",
  description: "The Department of Mechanical Engineering is committed to excellence in education, research, and innovation in mechanical systems, manufacturing, and energy technologies.",
  head_name: "Prof. Ravi Kumar Singh",
  contact_email: "mech.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide comprehensive mechanical engineering education, foster innovation in design and manufacturing, and develop engineers who can solve real-world problems.",
  vision: "To be a leading mechanical engineering department recognized for academic excellence, cutting-edge research, and industry collaboration.",
  facilities: [
    "Manufacturing Workshop",
    "CAD/CAM Laboratory",
    "Thermal Engineering Lab",
    "Fluid Mechanics Lab",
    "Materials Testing Lab",
    "Robotics & Automation Lab"
  ],
  programs_offered: [
    "B.Tech Mechanical Engineering",
    "M.Tech Mechanical Engineering",
    "Ph.D. in Mechanical Engineering",
    "Industrial Training Programs"
  ],
  achievements: [
    "State-of-the-art laboratory facilities",
    "Industry collaboration projects",
    "Research publications in top journals",
    "Student innovation and design competitions"
  ],
  location_details: "Engineering Block, Ground Floor, Workshop Area",
  gallery_images: [
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function MechanicalDepartment() {
  return <DepartmentTemplate departmentCode="MECH" fallbackData={fallbackData} />;
}