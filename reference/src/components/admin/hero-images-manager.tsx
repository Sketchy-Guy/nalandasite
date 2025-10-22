import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload, MoveUp, MoveDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const heroImageSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  display_order: z.number().min(0, "Order must be positive"),
});

type HeroImageForm = z.infer<typeof heroImageSchema>;

interface HeroImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function HeroImagesManager() {
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: heroImages, isLoading } = useQuery({
    queryKey: ["admin-hero-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as HeroImage[];
    },
  });

  const form = useForm<HeroImageForm>({
    resolver: zodResolver(heroImageSchema),
    defaultValues: {
      title: "",
      description: "",
      display_order: 0,
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    },
  });

  const createImageMutation = useMutation({
    mutationFn: async (data: HeroImageForm & { image_url: string }) => {
      const { error } = await supabase.from("hero_images").insert([{
        title: data.title,
        description: data.description || null,
        image_url: data.image_url,
        display_order: data.display_order,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-images"] });
      toast({ title: "Hero image created successfully" });
      setIsDialogOpen(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to create hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HeroImage> }) => {
      const { error } = await supabase
        .from("hero_images")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-images"] });
      toast({ title: "Hero image updated successfully" });
      setIsDialogOpen(false);
      setSelectedImage(null);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to update hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-images"] });
      toast({ title: "Hero image deleted successfully" });
      setDeleteImageId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("hero_images")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-images"] });
      toast({ title: "Hero image status updated" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, display_order }: { id: string; display_order: number }) => {
      const { error } = await supabase
        .from("hero_images")
        .update({ display_order })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-images"] });
    },
  });

  const handleEdit = (image: HeroImage) => {
    setSelectedImage(image);
    form.reset({
      title: image.title,
      description: image.description || "",
      display_order: image.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: HeroImageForm) => {
    try {
      let imageUrl = selectedImage?.image_url;
      
      if (selectedFile) {
        imageUrl = await uploadImageMutation.mutateAsync(selectedFile);
      }
      
      if (!imageUrl && !selectedImage) {
        toast({
          title: "Please select an image",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedImage) {
        updateImageMutation.mutate({
          id: selectedImage.id,
          data: { ...data, ...(imageUrl !== selectedImage.image_url && { image_url: imageUrl }) }
        });
      } else {
        createImageMutation.mutate({ ...data, image_url: imageUrl! });
      }
    } catch (error) {
      toast({
        title: "Failed to upload image",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const moveImage = (image: HeroImage, direction: 'up' | 'down') => {
    if (!heroImages) return;
    
    const currentIndex = heroImages.findIndex(img => img.id === image.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= heroImages.length) return;
    
    const targetImage = heroImages[targetIndex];
    
    reorderMutation.mutate({ id: image.id, display_order: targetImage.display_order });
    reorderMutation.mutate({ id: targetImage.id, display_order: image.display_order });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hero Images Management</h1>
          <p className="text-muted-foreground">Manage carousel images for the homepage</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedImage(null);
                setSelectedFile(null);
                form.reset({ display_order: (heroImages?.length || 0) });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage ? "Edit Hero Image" : "Add New Hero Image"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter image description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image File {!selectedImage && "*"}
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {selectedImage && !selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Leave empty to keep current image
                    </p>
                  )}
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      New file selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createImageMutation.isPending || updateImageMutation.isPending}
                  >
                    {selectedImage ? "Update" : "Create"} Image
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading hero images...</p>
          </div>
        ) : (
          heroImages?.map((image, index) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(image, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(image, 'down')}
                    disabled={index === (heroImages?.length || 1) - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{image.title}</CardTitle>
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Switch
                      checked={image.is_active}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: image.id,
                          is_active: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Order: {image.display_order}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(image)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteImageId(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteImageId}
        onOpenChange={() => setDeleteImageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hero image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteImageId) {
                  deleteImageMutation.mutate(deleteImageId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}