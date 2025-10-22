import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Master of Computer Applications",
  description: "The MCA program is designed to provide advanced knowledge in computer applications, software development, and emerging technologies to create skilled IT professionals.",
  head_name: "Prof. Anita Verma",
  contact_email: "mca.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide comprehensive postgraduate education in computer applications, emphasizing practical skills and research capabilities.",
  vision: "To be a premier MCA program producing highly skilled professionals ready for leadership roles in the IT industry.",
  facilities: [
    "Advanced Programming Lab",
    "Software Engineering Lab",
    "Data Analytics Lab",
    "Project Development Center",
    "Research Lab",
    "Seminar Hall"
  ],
  programs_offered: [
    "Master of Computer Applications (MCA)",
    "Research Programs",
    "Industry Collaboration Projects",
    "Internship Programs"
  ],
  achievements: [
    "High employment rate in top IT companies",
    "Outstanding academic performance",
    "Industry-relevant curriculum",
    "Strong alumni network"
  ],
  location_details: "Academic Block B, 3rd Floor, Room No. 301-308",
  gallery_images: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function MCADepartment() {
  return <DepartmentTemplate departmentCode="MCA" fallbackData={fallbackData} />;
}