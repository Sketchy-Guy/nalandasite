// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
// import { 
//   Heart, 
//   Plus, 
//   Pencil, 
//   Trash2, 
//   Search, 
//   Filter,
//   Users,
//   Clock,
//   MapPin,
//   DollarSign,
//   Calendar,
//   Dumbbell,
//   Brain,
//   Stethoscope,
//   Activity
// } from 'lucide-react';

// interface WellnessProgram {
//   id: string;
//   name: string;
//   description: string;
//   program_type: string;
//   instructor?: string;
//   schedule?: string;
//   duration_minutes?: number;
//   max_participants?: number;
//   location?: string;
//   fee?: number;
//   image_url?: string;
//   registration_required: boolean;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// const WellnessManager = () => {
//   const [programs, setPrograms] = useState<WellnessProgram[]>([]);
//   const [filteredPrograms, setFilteredPrograms] = useState<WellnessProgram[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingProgram, setEditingProgram] = useState<WellnessProgram | null>(null);
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     program_type: 'fitness',
//     instructor: '',
//     schedule: '',
//     duration_minutes: '',
//     max_participants: '',
//     location: '',
//     fee: '',
//     image_url: '',
//     registration_required: true,
//     is_active: true
//   });

//   const programTypes = [
//     'fitness', 'mental', 'counseling', 'medical', 'health', 'yoga', 'meditation', 'sports'
//   ];

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   useEffect(() => {
//     filterPrograms();
//   }, [programs, searchTerm, filterType]);

//   const fetchPrograms = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('wellness_programs')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPrograms(data || []);
//     } catch (error) {
//       console.error('Error fetching wellness programs:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch wellness programs",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterPrograms = () => {
//     let filtered = programs;

//     if (searchTerm) {
//       filtered = filtered.filter(program =>
//         program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         program.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterType !== 'all') {
//       filtered = filtered.filter(program => program.program_type === filterType);
//     }

//     setFilteredPrograms(filtered);
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       program_type: 'fitness',
//       instructor: '',
//       schedule: '',
//       duration_minutes: '',
//       max_participants: '',
//       location: '',
//       fee: '',
//       image_url: '',
//       registration_required: true,
//       is_active: true
//     });
//     setEditingProgram(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const programData = {
//         ...formData,
//         duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
//         max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
//         fee: formData.fee ? parseFloat(formData.fee) : null
//       };

//       if (editingProgram) {
//         const { error } = await supabase
//           .from('wellness_programs')
//           .update(programData)
//           .eq('id', editingProgram.id);

//         if (error) throw error;

//         toast({
//           title: "Success",
//           description: "Wellness program updated successfully"
//         });
//       } else {
//         const { error } = await supabase
//           .from('wellness_programs')
//           .insert(programData);

//         if (error) throw error;

//         toast({
//           title: "Success",
//           description: "Wellness program created successfully"
//         });
//       }

//       setIsDialogOpen(false);
//       resetForm();
//       fetchPrograms();
//     } catch (error) {
//       console.error('Error saving program:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save wellness program",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleEdit = (program: WellnessProgram) => {
//     setFormData({
//       name: program.name,
//       description: program.description || '',
//       program_type: program.program_type,
//       instructor: program.instructor || '',
//       schedule: program.schedule || '',
//       duration_minutes: program.duration_minutes?.toString() || '',
//       max_participants: program.max_participants?.toString() || '',
//       location: program.location || '',
//       fee: program.fee?.toString() || '',
//       image_url: program.image_url || '',
//       registration_required: program.registration_required,
//       is_active: program.is_active
//     });
//     setEditingProgram(program);
//     setIsDialogOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this wellness program?')) {
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('wellness_programs')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Wellness program deleted successfully"
//       });
      
//       fetchPrograms();
//     } catch (error) {
//       console.error('Error deleting program:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete wellness program",
//         variant: "destructive"
//       });
//     }
//   };

//   const getProgramIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'fitness':
//       case 'sports':
//         return Dumbbell;
//       case 'mental':
//       case 'counseling':
//         return Brain;
//       case 'medical':
//       case 'health':
//         return Stethoscope;
//       default:
//         return Activity;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <Card key={i}>
//               <CardHeader>
//                 <Skeleton className="h-6 w-3/4" />
//                 <Skeleton className="h-4 w-1/2" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-20 w-full" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <Heart className="h-8 w-8 text-primary" />
//             Wellness Programs Manager
//           </h1>
//           <p className="text-muted-foreground">Manage wellness and health programs</p>
//         </div>

//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={resetForm}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Program
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingProgram ? 'Edit Wellness Program' : 'Add New Wellness Program'}
//               </DialogTitle>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Tabs defaultValue="basic" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="basic">Basic Info</TabsTrigger>
//                   <TabsTrigger value="details">Details</TabsTrigger>
//                   <TabsTrigger value="settings">Settings</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="basic" className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Program Name *</Label>
//                     <Input
//                       id="name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       placeholder="Enter program name"
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea
//                       id="description"
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       placeholder="Describe the program"
//                       rows={3}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="program_type">Program Type *</Label>
//                       <Select
//                         value={formData.program_type}
//                         onValueChange={(value) => setFormData({ ...formData, program_type: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {programTypes.map((type) => (
//                             <SelectItem key={type} value={type}>
//                               {type.charAt(0).toUpperCase() + type.slice(1)}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="instructor">Instructor</Label>
//                       <Input
//                         id="instructor"
//                         value={formData.instructor}
//                         onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
//                         placeholder="Instructor name"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="image_url">Image URL</Label>
//                     <Input
//                       id="image_url"
//                       type="url"
//                       value={formData.image_url}
//                       onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
//                       placeholder="https://example.com/image.jpg"
//                     />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="details" className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="schedule">Schedule</Label>
//                     <Input
//                       id="schedule"
//                       value={formData.schedule}
//                       onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
//                       placeholder="e.g., Mon, Wed, Fri 6:00 AM - 7:00 AM"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="duration_minutes">Duration (minutes)</Label>
//                       <Input
//                         id="duration_minutes"
//                         type="number"
//                         value={formData.duration_minutes}
//                         onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
//                         placeholder="60"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="max_participants">Max Participants</Label>
//                       <Input
//                         id="max_participants"
//                         type="number"
//                         value={formData.max_participants}
//                         onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
//                         placeholder="20"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="location">Location</Label>
//                     <Input
//                       id="location"
//                       value={formData.location}
//                       onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                       placeholder="Gym, Wellness Center, etc."
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="fee">Fee (₹)</Label>
//                     <Input
//                       id="fee"
//                       type="number"
//                       step="0.01"
//                       value={formData.fee}
//                       onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="settings" className="space-y-4">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="registration_required"
//                       checked={formData.registration_required}
//                       onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
//                     />
//                     <Label htmlFor="registration_required">Registration Required</Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="is_active"
//                       checked={formData.is_active}
//                       onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
//                     />
//                     <Label htmlFor="is_active">Active</Label>
//                   </div>
//                 </TabsContent>
//               </Tabs>

//               <Separator />

//               <div className="flex justify-end space-x-2">
//                 <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingProgram ? 'Update' : 'Create'} Program
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search programs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <Select value={filterType} onValueChange={setFilterType}>
//           <SelectTrigger className="w-full sm:w-[200px]">
//             <Filter className="mr-2 h-4 w-4" />
//             <SelectValue placeholder="Filter by type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             {programTypes.map((type) => (
//               <SelectItem key={type} value={type}>
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Programs Grid */}
//       {filteredPrograms.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <Heart className="h-16 w-16 text-muted-foreground mb-4" />
//             <h3 className="text-xl font-semibold mb-2">No Wellness Programs Found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               {searchTerm || filterType !== 'all' 
//                 ? 'No programs match your current filters.' 
//                 : 'Get started by adding your first wellness program.'}
//             </p>
//             {!searchTerm && filterType === 'all' && (
//               <Button onClick={() => setIsDialogOpen(true)}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add First Program
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredPrograms.map((program, index) => {
//             const Icon = getProgramIcon(program.program_type);
//             return (
//               <motion.div
//                 key={program.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <Card className="group hover:shadow-lg transition-shadow h-full">
//                   <CardHeader>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                         <Icon className="h-5 w-5 text-primary" />
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Badge variant="secondary">{program.program_type}</Badge>
//                         <Badge variant={program.is_active ? "default" : "secondary"}>
//                           {program.is_active ? "Active" : "Inactive"}
//                         </Badge>
//                       </div>
//                     </div>
//                     <CardTitle className="text-lg line-clamp-2">{program.name}</CardTitle>
//                     {program.description && (
//                       <CardDescription className="line-clamp-2">
//                         {program.description}
//                       </CardDescription>
//                     )}
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {program.instructor && (
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <Users className="h-4 w-4 mr-2" />
//                           {program.instructor}
//                         </div>
//                       )}
                      
//                       {program.schedule && (
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <Clock className="h-4 w-4 mr-2" />
//                           {program.schedule}
//                         </div>
//                       )}
                      
//                       {program.location && (
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <MapPin className="h-4 w-4 mr-2" />
//                           {program.location}
//                         </div>
//                       )}
                      
//                       {program.duration_minutes && (
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <Clock className="h-4 w-4 mr-2" />
//                           {program.duration_minutes} minutes
//                         </div>
//                       )}

//                       {program.fee !== undefined && program.fee > 0 && (
//                         <div className="flex items-center text-sm font-medium text-primary">
//                           <DollarSign className="h-4 w-4 mr-2" />
//                           ₹{program.fee}
//                         </div>
//                       )}

//                       {program.registration_required && (
//                         <div className="flex items-center text-sm text-orange-600">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           Registration required
//                         </div>
//                       )}
//                     </div>

//                     <Separator className="my-4" />
                    
//                     <div className="flex justify-end space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(program)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDelete(program.id)}
//                         className="text-destructive hover:text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WellnessManager;