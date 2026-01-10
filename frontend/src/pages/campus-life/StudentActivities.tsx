// import { useState, useEffect } from "react";
// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar, Users, Trophy, Mail, MapPin, Clock } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";

// interface StudentActivity {
//   id: string;
//   name: string;
//   description: string | null;
//   category: string;
//   image_url: string | null;
//   coordinator_name: string | null;
//   coordinator_email: string | null;
//   meeting_schedule: string | null;
//   location: string | null;
//   member_count: number | null;
//   achievements: string[] | null;
//   is_active: boolean;
// }

// export default function StudentActivities() {
//   const [activities, setActivities] = useState<StudentActivity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   const fetchActivities = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('student_activities')
//         .select('*')
//         .eq('is_active', true)
//         .order('name');
      
//       if (error) throw error;
//       setActivities(data || []);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = ["all", ...Array.from(new Set(activities.map(a => a.category)))];
//   const filteredActivities = selectedCategory === "all" 
//     ? activities 
//     : activities.filter(a => a.category === selectedCategory);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Header />
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">Loading student activities...</div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       {/* Hero Section */}
//       <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary/5">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Activities</h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             Discover various clubs, societies, and activities that enrich student life at NIT Nalanda
//           </p>
//         </div>
//       </section>

//       {/* Category Filter */}
//       <section className="py-8 border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-wrap gap-2 justify-center">
//             {categories.map((category) => (
//               <Button
//                 key={category}
//                 variant={selectedCategory === category ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category)}
//                 className="capitalize"
//               >
//                 {category}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Activities Grid */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           {filteredActivities.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">No activities found in this category.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredActivities.map((activity) => (
//                 <Card key={activity.id} className="overflow-hidden">
//                   {activity.image_url && (
//                     <div className="h-48 overflow-hidden">
//                       <img
//                         src={activity.image_url}
//                         alt={activity.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <CardHeader>
//                     <div className="flex justify-between items-start">
//                       <CardTitle className="text-lg">{activity.name}</CardTitle>
//                       <Badge variant="secondary" className="capitalize">
//                         {activity.category}
//                       </Badge>
//                     </div>
//                     {activity.description && (
//                       <CardDescription>{activity.description}</CardDescription>
//                     )}
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     {activity.coordinator_name && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Users className="h-4 w-4" />
//                         <span>Coordinator: {activity.coordinator_name}</span>
//                       </div>
//                     )}
//                     {activity.coordinator_email && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Mail className="h-4 w-4" />
//                         <span>{activity.coordinator_email}</span>
//                       </div>
//                     )}
//                     {activity.meeting_schedule && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Clock className="h-4 w-4" />
//                         <span>{activity.meeting_schedule}</span>
//                       </div>
//                     )}
//                     {activity.location && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <MapPin className="h-4 w-4" />
//                         <span>{activity.location}</span>
//                       </div>
//                     )}
//                     {activity.member_count && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Users className="h-4 w-4" />
//                         <span>{activity.member_count} Members</span>
//                       </div>
//                     )}
//                     {activity.achievements && activity.achievements.length > 0 && (
//                       <div>
//                         <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
//                           <Trophy className="h-4 w-4" />
//                           Recent Achievements
//                         </h4>
//                         <ul className="text-sm text-muted-foreground space-y-1">
//                           {activity.achievements.slice(0, 3).map((achievement, index) => (
//                             <li key={index}>• {achievement}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }