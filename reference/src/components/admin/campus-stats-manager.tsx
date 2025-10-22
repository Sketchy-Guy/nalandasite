import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, BarChart3, Users, GraduationCap, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampusStat {
  id?: string;
  stat_name: string;
  stat_value: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "Users", label: "Users", component: Users },
  { value: "GraduationCap", label: "Graduation Cap", component: GraduationCap },
  { value: "Trophy", label: "Trophy", component: Trophy },
  { value: "BarChart3", label: "Bar Chart", component: BarChart3 }
];

export function CampusStatsManager() {
  const [stats, setStats] = useState<CampusStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<CampusStat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_stats')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campus statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;

    try {
      if (editingStat.id) {
        await supabase
          .from('campus_stats')
          .update(editingStat)
          .eq('id', editingStat.id);
      } else {
        await supabase
          .from('campus_stats')
          .insert([editingStat]);
      }

      toast({
        title: "Success",
        description: `Statistic ${editingStat.id ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingStat(null);
      fetchStats();
    } catch (error) {
      console.error('Error saving stat:', error);
      toast({
        title: "Error",
        description: "Failed to save statistic",
        variant: "destructive",
      });
    }
  };

  const deleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;

    try {
      await supabase.from('campus_stats').delete().eq('id', id);
      toast({
        title: "Success",
        description: "Statistic deleted successfully",
      });
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast({
        title: "Error",
        description: "Failed to delete statistic",
        variant: "destructive",
      });
    }
  };

  const openDialog = (stat?: CampusStat) => {
    if (stat) {
      setEditingStat(stat);
    } else {
      setEditingStat({
        stat_name: "",
        stat_value: "",
        icon: "Users",
        description: "",
        display_order: stats.length,
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.component : Users;
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campus Statistics</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Statistic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingStat?.id ? 'Edit Statistic' : 'Add Statistic'}
              </DialogTitle>
            </DialogHeader>
            {editingStat && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="stat_name">Statistic Name</Label>
                  <Input
                    id="stat_name"
                    value={editingStat.stat_name}
                    onChange={(e) => setEditingStat({...editingStat, stat_name: e.target.value})}
                    placeholder="e.g., Total Students"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stat_value">Value</Label>
                  <Input
                    id="stat_value"
                    value={editingStat.stat_value}
                    onChange={(e) => setEditingStat({...editingStat, stat_value: e.target.value})}
                    placeholder="e.g., 5000+"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={editingStat.icon}
                    onValueChange={(value) => setEditingStat({...editingStat, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.component className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingStat.description}
                    onChange={(e) => setEditingStat({...editingStat, description: e.target.value})}
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={editingStat.display_order}
                    onChange={(e) => setEditingStat({...editingStat, display_order: parseInt(e.target.value)})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingStat.is_active}
                    onCheckedChange={(checked) => setEditingStat({...editingStat, is_active: checked})}
                  />
                  <Label>Active</Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingStat.id ? 'Update' : 'Create'} Statistic
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = getIconComponent(stat.icon || "Users");
          return (
            <Card key={stat.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">{stat.stat_name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDialog(stat)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteStat(stat.id!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.stat_value}
                </div>
                {stat.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {stat.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Order: {stat.display_order}
                  </span>
                  <Badge variant={stat.is_active ? "default" : "secondary"} className="text-xs">
                    {stat.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stats.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No statistics found. Create your first statistic!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}