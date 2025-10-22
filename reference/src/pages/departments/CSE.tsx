import { DepartmentTemplate } from '@/components/department-template';

const fallbackData = {
  name: "Computer Science & Engineering",
  description: "The Department of Computer Science & Engineering at our institute is dedicated to providing excellence in education, research, and innovation in the field of computer science and technology.",
  head_name: "Dr. Rajesh Kumar",
  contact_email: "cse.head@nalanda.edu",
  hero_image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  mission: "To provide quality education in computer science and engineering, foster innovation, and develop skilled professionals who can contribute to society and industry.",
  vision: "To be a center of excellence in computer science education and research, producing globally competent engineers and entrepreneurs.",
  facilities: [
    "Advanced Computing Laboratory",
    "Software Development Lab",
    "AI & Machine Learning Lab",
    "Cybersecurity Lab",
    "High-Performance Computing Center",
    "Research & Development Center"
  ],
  programs_offered: [
    "B.Tech Computer Science & Engineering",
    "M.Tech Computer Science",
    "Ph.D. in Computer Science",
    "Certification Courses"
  ],
  achievements: [
    "Ranked among top 10 CSE departments in the region",
    "100% placement record for last 5 years",
    "Over 50 research publications in international journals",
    "Winner of multiple inter-college coding competitions"
  ],
  location_details: "Main Building, 2nd Floor, Room No. 201-210",
  gallery_images: [
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function CSEDepartment() {
  return <DepartmentTemplate departmentCode="CSE" fallbackData={fallbackData} />;
}