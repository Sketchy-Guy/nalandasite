// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Pencil, Trash2, Plus, Users, Calendar, MapPin } from "lucide-react";

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
//   created_at: string;
//   updated_at: string;
// }

// const categories = [
//   'academic', 'cultural', 'technical', 'sports', 'social', 'literary', 'arts', 'music', 'debate', 'other'
// ];

// export default function StudentActivitiesManager() {
//   const [activities, setActivities] = useState<StudentActivity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<StudentActivity | null>(null);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     category: 'academic',
//     image_url: '',
//     coordinator_name: '',
//     coordinator_email: '',
//     meeting_schedule: '',
//     location: '',
//     member_count: '',
//     achievements: '',
//     is_active: true,
//   });

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   const fetchActivities = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('student_activities')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       setActivities(data || []);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to fetch activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       category: 'academic',
//       image_url: '',
//       coordinator_name: '',
//       coordinator_email: '',
//       meeting_schedule: '',
//       location: '',
//       member_count: '',
//       achievements: '',
//       is_active: true,
//     });
//     setEditingActivity(null);
//   };

//   const openDialog = (activity?: StudentActivity) => {
//     if (activity) {
//       setEditingActivity(activity);
//       setFormData({
//         name: activity.name,
//         description: activity.description || '',
//         category: activity.category,
//         image_url: activity.image_url || '',
//         coordinator_name: activity.coordinator_name || '',
//         coordinator_email: activity.coordinator_email || '',
//         meeting_schedule: activity.meeting_schedule || '',
//         location: activity.location || '',
//         member_count: activity.member_count?.toString() || '',
//         achievements: activity.achievements?.join('\n') || '',
//         is_active: activity.is_active,
//       });
//     } else {
//       resetForm();
//     }
//     setDialogOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const activityData = {
//       name: formData.name,
//       description: formData.description || null,
//       category: formData.category,
//       image_url: formData.image_url || null,
//       coordinator_name: formData.coordinator_name || null,
//       coordinator_email: formData.coordinator_email || null,
//       meeting_schedule: formData.meeting_schedule || null,
//       location: formData.location || null,
//       member_count: formData.member_count ? parseInt(formData.member_count) : null,
//       achievements: formData.achievements ? formData.achievements.split('\n').filter(a => a.trim()) : null,
//       is_active: formData.is_active,
//     };

//     try {
//       if (editingActivity) {
//         const { error } = await supabase
//           .from('student_activities')
//           .update(activityData)
//           .eq('id', editingActivity.id);
        
//         if (error) throw error;
//         toast.success('Activity updated successfully');
//       } else {
//         const { error } = await supabase
//           .from('student_activities')
//           .insert([activityData]);
        
//         if (error) throw error;
//         toast.success('Activity created successfully');
//       }
      
//       setDialogOpen(false);
//       resetForm();
//       fetchActivities();
//     } catch (error) {
//       console.error('Error saving activity:', error);
//       toast.error('Failed to save activity');
//     }
//   };

//   const deleteActivity = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this activity?')) return;
    
//     try {
//       const { error } = await supabase
//         .from('student_activities')
//         .delete()
//         .eq('id', id);
      
//       if (error) throw error;
//       toast.success('Activity deleted successfully');
//       fetchActivities();
//     } catch (error) {
//       console.error('Error deleting activity:', error);
//       toast.error('Failed to delete activity');
//     }
//   };

//   if (loading) {
//     return <div className="p-6">Loading activities...</div>;
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Student Activities Manager</h1>
//           <p className="text-muted-foreground">Manage student clubs, societies, and activities</p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => openDialog()}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Activity
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingActivity ? 'Edit Activity' : 'Add New Activity'}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingActivity ? 'Update activity information' : 'Create a new student activity'}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="name">Activity Name *</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="category">Category *</Label>
//                   <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category} value={category} className="capitalize">
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows={3}
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="image_url">Image URL</Label>
//                 <Input
//                   id="image_url"
//                   type="url"
//                   value={formData.image_url}
//                   onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="coordinator_name">Coordinator Name</Label>
//                   <Input
//                     id="coordinator_name"
//                     value={formData.coordinator_name}
//                     onChange={(e) => setFormData({ ...formData, coordinator_name: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="coordinator_email">Coordinator Email</Label>
//                   <Input
//                     id="coordinator_email"
//                     type="email"
//                     value={formData.coordinator_email}
//                     onChange={(e) => setFormData({ ...formData, coordinator_email: e.target.value })}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="meeting_schedule">Meeting Schedule</Label>
//                   <Input
//                     id="meeting_schedule"
//                     value={formData.meeting_schedule}
//                     onChange={(e) => setFormData({ ...formData, meeting_schedule: e.target.value })}
//                     placeholder="e.g., Every Friday 4-6 PM"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     value={formData.location}
//                     onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <Label htmlFor="member_count">Member Count</Label>
//                 <Input
//                   id="member_count"
//                   type="number"
//                   value={formData.member_count}
//                   onChange={(e) => setFormData({ ...formData, member_count: e.target.value })}
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="achievements">Achievements (one per line)</Label>
//                 <Textarea
//                   id="achievements"
//                   value={formData.achievements}
//                   onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
//                   rows={4}
//                   placeholder="Inter-college competition winner 2023&#10;Best club award 2022"
//                 />
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="is_active"
//                   checked={formData.is_active}
//                   onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
//                 />
//                 <Label htmlFor="is_active">Active</Label>
//               </div>
              
//               <div className="flex justify-end space-x-2">
//                 <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingActivity ? 'Update' : 'Create'} Activity
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {activities.map((activity) => (
//           <Card key={activity.id}>
//             {activity.image_url && (
//               <div className="h-48 overflow-hidden">
//                 <img
//                   src={activity.image_url}
//                   alt={activity.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <CardTitle className="text-lg">{activity.name}</CardTitle>
//                 <Badge variant="secondary" className="capitalize">
//                   {activity.category}
//                 </Badge>
//               </div>
//               {activity.description && (
//                 <CardDescription>{activity.description}</CardDescription>
//               )}
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {activity.coordinator_name && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <Users className="h-4 w-4" />
//                   <span>{activity.coordinator_name}</span>
//                 </div>
//               )}
//               {activity.meeting_schedule && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <Calendar className="h-4 w-4" />
//                   <span>{activity.meeting_schedule}</span>
//                 </div>
//               )}
//               {activity.location && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <MapPin className="h-4 w-4" />
//                   <span>{activity.location}</span>
//                 </div>
//               )}
//               {activity.member_count && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <Users className="h-4 w-4" />
//                   <span>{activity.member_count} members</span>
//                 </div>
//               )}
//               <div className="flex justify-between items-center pt-4">
//                 <Badge variant={activity.is_active ? "default" : "secondary"}>
//                   {activity.is_active ? "Active" : "Inactive"}
//                 </Badge>
//                 <div className="space-x-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => openDialog(activity)}
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => deleteActivity(activity.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {activities.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">No activities found. Add your first activity to get started.</p>
//         </div>
//       )}
//     </div>
//   );
// }