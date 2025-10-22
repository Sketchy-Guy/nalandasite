import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Information Technology",
  description: "The Department of Information Technology focuses on the practical application of technology solutions, preparing students for careers in IT industry and digital transformation.",
  head_name: "Dr. Priya Sharma",
  contact_email: "it.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide comprehensive IT education, develop technical expertise, and create industry-ready professionals capable of driving digital innovation.",
  vision: "To be a leading department in information technology education, fostering innovation and entrepreneurship in the digital age.",
  facilities: [
    "Network Administration Lab",
    "Database Management Lab",
    "Web Development Studio",
    "Mobile App Development Lab",
    "Cloud Computing Center",
    "IT Infrastructure Lab"
  ],
  programs_offered: [
    "B.Tech Information Technology",
    "M.Tech IT",
    "Diploma in IT",
    "Industry Certification Programs"
  ],
  achievements: [
    "Industry partnerships with leading tech companies",
    "95% placement rate in IT sector",
    "Award-winning student projects",
    "Active research in emerging technologies"
  ],
  location_details: "IT Block, Ground Floor, Room No. 101-115",
  gallery_images: [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function ITDepartment() {
  return <DepartmentTemplate departmentCode="IT" fallbackData={fallbackData} />;
}