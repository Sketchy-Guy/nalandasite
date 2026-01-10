// import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// interface CampusLifeContent {
//   id: string;
//   page_slug: string;
//   title: string;
//   hero_image_url: string;
//   content: string;
//   meta_description: string;
//   features: string[];
//   highlights: string[];
//   gallery_images: string[];
//   is_active: boolean;
//   display_order: number;
// }

// export default function CampusLifeManager() {
//   const [content, setContent] = useState<CampusLifeContent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingItem, setEditingItem] = useState<CampusLifeContent | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     page_slug: '',
//     title: '',
//     hero_image_url: '',
//     content: '',
//     meta_description: '',
//     features: [] as string[],
//     highlights: [] as string[],
//     gallery_images: [] as string[],
//     is_active: true,
//     display_order: 0
//   });

//   const [newFeature, setNewFeature] = useState('');
//   const [newHighlight, setNewHighlight] = useState('');
//   const [newGalleryImage, setNewGalleryImage] = useState('');

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   const fetchContent = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('campus_life_content')
//         .select('*')
//         .order('display_order');

//       if (error) throw error;
//       setContent(data || []);
//     } catch (error) {
//       console.error('Error fetching campus life content:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch campus life content",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingItem) {
//         const { error } = await supabase
//           .from('campus_life_content')
//           .update(formData)
//           .eq('id', editingItem.id);
//         if (error) throw error;
//         toast({ title: "Success", description: "Content updated successfully" });
//       } else {
//         const { error } = await supabase
//           .from('campus_life_content')
//           .insert([formData]);
//         if (error) throw error;
//         toast({ title: "Success", description: "Content created successfully" });
//       }
//       resetForm();
//       fetchContent();
//     } catch (error) {
//       console.error('Error saving content:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save content",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this content?')) return;

//     try {
//       const { error } = await supabase
//         .from('campus_life_content')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
//       toast({ title: "Success", description: "Content deleted successfully" });
//       fetchContent();
//     } catch (error) {
//       console.error('Error deleting content:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete content",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = (item: CampusLifeContent) => {
//     setEditingItem(item);
//     setFormData({
//       page_slug: item.page_slug,
//       title: item.title,
//       hero_image_url: item.hero_image_url || '',
//       content: item.content || '',
//       meta_description: item.meta_description || '',
//       features: item.features || [],
//       highlights: item.highlights || [],
//       gallery_images: item.gallery_images || [],
//       is_active: item.is_active,
//       display_order: item.display_order
//     });
//     setShowForm(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       page_slug: '',
//       title: '',
//       hero_image_url: '',
//       content: '',
//       meta_description: '',
//       features: [],
//       highlights: [],
//       gallery_images: [],
//       is_active: true,
//       display_order: 0
//     });
//     setEditingItem(null);
//     setShowForm(false);
//     setNewFeature('');
//     setNewHighlight('');
//     setNewGalleryImage('');
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()]
//       }));
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   const addHighlight = () => {
//     if (newHighlight.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         highlights: [...prev.highlights, newHighlight.trim()]
//       }));
//       setNewHighlight('');
//     }
//   };

//   const removeHighlight = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       highlights: prev.highlights.filter((_, i) => i !== index)
//     }));
//   };

//   const addGalleryImage = () => {
//     if (newGalleryImage.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         gallery_images: [...prev.gallery_images, newGalleryImage.trim()]
//       }));
//       setNewGalleryImage('');
//     }
//   };

//   const removeGalleryImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       gallery_images: prev.gallery_images.filter((_, i) => i !== index)
//     }));
//   };

//   if (loading) {
//     return <div className="flex justify-center p-8">Loading...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Campus Life Content Manager</h1>
//         <Button onClick={() => setShowForm(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Content
//         </Button>
//       </div>

//       {showForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>
//               {editingItem ? 'Edit Campus Life Content' : 'Add New Campus Life Content'}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="page_slug">Page Slug</Label>
//                   <Input
//                     id="page_slug"
//                     value={formData.page_slug}
//                     onChange={(e) => setFormData(prev => ({ ...prev, page_slug: e.target.value }))}
//                     placeholder="e.g., overview, sports, clubs"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="hero_image_url">Hero Image URL</Label>
//                 <Input
//                   id="hero_image_url"
//                   value={formData.hero_image_url}
//                   onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
//                   placeholder="https://example.com/hero-image.jpg"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="content">Content</Label>
//                 <Textarea
//                   id="content"
//                   value={formData.content}
//                   onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
//                   rows={4}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="meta_description">Meta Description</Label>
//                 <Textarea
//                   id="meta_description"
//                   value={formData.meta_description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
//                   rows={2}
//                 />
//               </div>

//               {/* Features */}
//               <div>
//                 <Label>Features</Label>
//                 <div className="flex gap-2 mb-2">
//                   <Input
//                     value={newFeature}
//                     onChange={(e) => setNewFeature(e.target.value)}
//                     placeholder="Add feature"
//                   />
//                   <Button type="button" onClick={addFeature} variant="outline">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.features.map((feature, index) => (
//                     <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                       {feature}
//                       <X
//                         className="h-3 w-3 cursor-pointer"
//                         onClick={() => removeFeature(index)}
//                       />
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {/* Highlights */}
//               <div>
//                 <Label>Highlights</Label>
//                 <div className="flex gap-2 mb-2">
//                   <Input
//                     value={newHighlight}
//                     onChange={(e) => setNewHighlight(e.target.value)}
//                     placeholder="Add highlight"
//                   />
//                   <Button type="button" onClick={addHighlight} variant="outline">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.highlights.map((highlight, index) => (
//                     <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                       {highlight}
//                       <X
//                         className="h-3 w-3 cursor-pointer"
//                         onClick={() => removeHighlight(index)}
//                       />
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {/* Gallery Images */}
//               <div>
//                 <Label>Gallery Images</Label>
//                 <div className="flex gap-2 mb-2">
//                   <Input
//                     value={newGalleryImage}
//                     onChange={(e) => setNewGalleryImage(e.target.value)}
//                     placeholder="Add gallery image URL"
//                   />
//                   <Button type="button" onClick={addGalleryImage} variant="outline">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                   {formData.gallery_images.map((image, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={image}
//                         alt={`Gallery ${index + 1}`}
//                         className="w-full h-20 object-cover rounded"
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="sm"
//                         className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
//                         onClick={() => removeGalleryImage(index)}
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="display_order">Display Order</Label>
//                   <Input
//                     id="display_order"
//                     type="number"
//                     value={formData.display_order}
//                     onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     checked={formData.is_active}
//                     onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
//                   />
//                   <Label>Active</Label>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button type="submit">
//                   {editingItem ? 'Update' : 'Create'} Content
//                 </Button>
//                 <Button type="button" variant="outline" onClick={resetForm}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid gap-4">
//         {content.map((item) => (
//           <Card key={item.id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     {item.title}
//                     <Badge variant={item.is_active ? "default" : "secondary"}>
//                       {item.is_active ? "Active" : "Inactive"}
//                     </Badge>
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Slug: {item.page_slug} | Order: {item.display_order}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
//                     <Edit2 className="h-4 w-4" />
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {item.hero_image_url && (
//                 <img
//                   src={item.hero_image_url}
//                   alt={item.title}
//                   className="w-full h-32 object-cover rounded mb-4"
//                 />
//               )}

//               {item.content && (
//                 <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
//                   {item.content}
//                 </p>
//               )}

//               {item.features && item.features.length > 0 && (
//                 <div className="mb-2">
//                   <span className="text-sm font-medium">Features: </span>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {item.features.slice(0, 3).map((feature, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
//                         {feature}
//                       </Badge>
//                     ))}
//                     {item.features.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{item.features.length - 3} more
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {item.gallery_images && item.gallery_images.length > 0 && (
//                 <div>
//                   <span className="text-sm font-medium">Gallery: </span>
//                   <span className="text-sm text-muted-foreground">
//                     {item.gallery_images.length} images
//                   </span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
/*
 * CAMPUS LIFE MANAGER - DISABLED FOR DJANGO MIGRATION
 * 
 * This component manages dynamic content pages for the Campus Life section.
 * Currently uses Supabase - needs to be migrated to Django backend.
 * 
 * Features:
 * - Creates/edits campus life pages with unique slugs
 * - Manages hero images, content, features, highlights, and galleries
 * - CRUD operations for 13 campus life sections
 * 
 * TODO: Migrate to Django
 * 1. Create CampusLifeContent model in Django
 * 2. Create serializer and viewset
 * 3. Add API endpoints
 * 4. Update frontend to use api.campusLife
 * 5. Create frontend pages to display content
 * 
 * TEMPORARILY DISABLED - Will be re-enabled after Django migration
 */
