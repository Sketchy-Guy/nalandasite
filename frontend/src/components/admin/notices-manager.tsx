import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
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

const noticeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  is_featured: z.boolean().optional(),
});

type NoticeForm = z.infer<typeof noticeSchema>;

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  is_active: boolean;
  is_new: boolean;
  is_featured: boolean;
  link?: string;
  created_at: string;
  updated_at: string;
}

export default function NoticesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteNoticeId, setDeleteNoticeId] = useState<string | null>(null);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notices, isLoading } = useQuery({
    queryKey: ["admin-notices"],
    queryFn: async () => {
      try {
        const response = await api.notices.list({ ordering: '-created_at' });
        return Array.isArray(response) ? response : (response.results || []);
      } catch (error) {
        console.error('Error fetching notices:', error);
        return [];
      }
    },
  });

  const form = useForm<NoticeForm>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      priority: "Medium",
      link: "",
      is_featured: false,
    },
  });

  const createNoticeMutation = useMutation({
    mutationFn: async (data: NoticeForm) => {
      return await api.notices.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast({ title: "Notice created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create notice",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Notice> }) => {
      return await api.notices.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast({ title: "Notice updated successfully" });
      setIsDialogOpen(false);
      setSelectedNotice(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to update notice",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting notice with ID:', id);
      const response = await api.notices.delete(id);
      console.log('Delete response:', response);
      return response;
    },
    onSuccess: (data, variables) => {
      console.log('Notice deleted successfully:', variables);
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast({ 
        title: "Success",
        description: "Notice deleted permanently from database" 
      });
      setDeleteNoticeId(null);
    },
    onError: (error, variables) => {
      console.error('Delete error:', error, 'Notice ID:', variables);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete notice from database",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      console.log('Sending API request:', { id, is_active });
      const response = await api.notices.patch(id, { is_active });
      console.log('API response:', response);
      return response;
    },
    onSuccess: (data, variables) => {
      console.log('Toggle success:', { data, variables });
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast({ 
        title: "Success",
        description: `Notice ${variables.is_active ? 'activated' : 'deactivated'} successfully` 
      });
    },
    onError: (error, variables) => {
      console.error('Toggle error:', error, variables);
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] }); // Refresh to revert UI
      toast({
        title: "Error",
        description: `Failed to ${variables.is_active ? 'activate' : 'deactivate'} notice`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    form.reset({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      priority: notice.priority,
      link: notice.link || "",
      is_featured: notice.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handlePreview = (notice: Notice) => {
    setPreviewNotice(notice);
    setIsPreviewOpen(true);
  };

  const getPriorityColor = (priority: string, isFeatured: boolean) => {
    if (isFeatured) {
      // Different colors for featured notices based on priority
      switch (priority.toLowerCase()) {
        case "high":
          return "destructive"; // Red background for featured high priority
        case "medium":
          return "default"; // Blue background for featured medium priority  
        case "low":
          return "secondary"; // Gray background for featured low priority
        default:
          return "default";
      }
    }
    // Regular priority colors (non-featured)
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority: string, isFeatured: boolean) => {
    if (isFeatured) {
      return `⭐ Featured (${priority})`;
    }
    return priority;
  };

  const handleSubmit = (data: NoticeForm) => {
    if (selectedNotice) {
      updateNoticeMutation.mutate({ id: selectedNotice.id, data });
    } else {
      createNoticeMutation.mutate(data);
    }
  };

  const filteredNotices = notices?.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold truncate">Notices Management</h1>
          <p className="text-xs lg:text-sm text-muted-foreground truncate">Create and manage notices for the website</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedNotice(null);
                form.reset();
              }}
              className="shrink-0 w-full lg:w-auto text-sm px-3 lg:px-4 mr-2 lg:mr-4"
              size="sm"
            >
              <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedNotice ? "Edit Notice" : "Create New Notice"}
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
                        <Input placeholder="Enter notice title" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter notice description"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Drive Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://drive.google.com/file/d/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        If provided, clicking the notice will open this link. Leave empty for text-only notices.
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Notice</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Display this notice in the featured section on the homepage
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Examination">Examination</SelectItem>
                            <SelectItem value="Admission">Admission</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Holiday">Holiday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    disabled={createNoticeMutation.isPending || updateNoticeMutation.isPending}
                  >
                    {selectedNotice ? "Update" : "Create"} Notice
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-4 lg:pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Notices ({filteredNotices?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading notices...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] lg:min-w-[250px]">Title</TableHead>
                    <TableHead className="min-w-[100px] lg:min-w-[120px]">Category</TableHead>
                    <TableHead className="min-w-[120px] lg:min-w-[140px]">Priority</TableHead>
                    <TableHead className="min-w-[80px] lg:min-w-[100px]">Link</TableHead>
                    <TableHead className="min-w-[100px] lg:min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[100px] lg:min-w-[120px]">Created</TableHead>
                    <TableHead className="text-right min-w-[100px] lg:min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotices?.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="max-w-[200px] lg:max-w-[250px]">
                        <div>
                          <button
                            onClick={() => handlePreview(notice)}
                            className="font-medium text-sm lg:text-base text-left hover:text-primary hover:underline cursor-pointer break-words"
                          >
                            {notice.title}
                          </button>
                          <div className="text-xs text-muted-foreground truncate">
                            {notice.description}
                          </div>
                        </div>
                      </TableCell>
                    <TableCell>
                      <Badge variant="outline">{notice.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getPriorityColor(notice.priority, notice.is_featured)}
                        className={notice.is_featured ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300" : ""}
                      >
                        {getPriorityText(notice.priority, notice.is_featured)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notice.link ? (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-blue-600">Has Link</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Text Only</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notice.is_active}
                          disabled={toggleActiveMutation.isPending}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({
                              id: notice.id,
                              is_active: checked,
                            })
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          {toggleActiveMutation.isPending ? "Updating..." : (notice.is_active ? "Active" : "Inactive")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {new Date(notice.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: '2-digit'
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(notice)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteNoticeId(notice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteNoticeId}
        onOpenChange={() => setDeleteNoticeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteNoticeId) {
                  deleteNoticeMutation.mutate(deleteNoticeId);
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