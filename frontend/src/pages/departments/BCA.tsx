import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Bachelor of Computer Applications",
  description: "The BCA program provides comprehensive undergraduate education in computer applications, programming, and software development fundamentals.",
  head_name: "Dr. Suresh Patel",
  contact_email: "bca.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide quality undergraduate education in computer applications and prepare students for successful careers in IT and software industry.",
  vision: "To be a leading BCA program known for academic excellence and industry readiness of graduates.",
  facilities: [
    "Programming Laboratory",
    "Computer Fundamentals Lab",
    "Web Design Studio",
    "Project Lab",
    "Digital Library",
    "Student Computing Center"
  ],
  programs_offered: [
    "Bachelor of Computer Applications (BCA)",
    "Add-on Courses",
    "Skill Development Programs",
    "Industry Training"
  ],
  achievements: [
    "Excellent academic results",
    "Strong industry placements",
    "Student innovation projects",
    "Active coding clubs"
  ],
  location_details: "Academic Block A, 1st Floor, Room No. 101-110",
  gallery_images: [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function BCADepartment() {
  return <DepartmentTemplate departmentCode="BCA" fallbackData={fallbackData} />;
}