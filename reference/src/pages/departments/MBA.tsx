import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Master of Business Administration",
  description: "The MBA program is designed to develop future business leaders with strong analytical, strategic, and leadership skills required for today's dynamic business environment.",
  head_name: "Dr. Sunita Agarwal",
  contact_email: "mba.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide world-class business education, develop ethical business leaders, and contribute to the advancement of management knowledge and practice.",
  vision: "To be a premier business school recognized for academic excellence, industry relevance, and global perspective.",
  facilities: [
    "Executive Classroom",
    "Case Study Hall",
    "Business Simulation Lab",
    "Corporate Boardroom",
    "Management Library",
    "Entrepreneurship Center"
  ],
  programs_offered: [
    "Master of Business Administration (MBA)",
    "Executive MBA",
    "Management Development Programs",
    "Industry Workshops"
  ],
  achievements: [
    "High placement rates in top companies",
    "Industry mentorship programs",
    "Student entrepreneurship initiatives",
    "International collaborations"
  ],
  location_details: "Management Block, 2nd Floor, Room No. 201-210",
  gallery_images: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function MBADepartment() {
  return <DepartmentTemplate departmentCode="MBA" fallbackData={fallbackData} />;
}