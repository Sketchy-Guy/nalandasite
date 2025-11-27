import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Plus, X, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Program {
    id: string;
    name: string;
    code: string;
    is_predefined: boolean;
}

interface Trade {
    id: string;
    name: string;
    code: string;
    program: string;
    is_predefined: boolean;
}

interface DepartmentFormData {
    name: string;
    code: string;
    description: string;
    head_name: string;
    contact_email: string;
    hero_image: File | null;
    mission: string;
    vision: string;
    facilities: string[];
    programs_offered: string[];
    achievements: string[];
    location_details: string;
    is_active: boolean;
}

interface DepartmentWizardProps {
    editingDept: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function DepartmentWizard({ editingDept, onClose, onSuccess }: DepartmentWizardProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [isDirectBranch, setIsDirectBranch] = useState(false);
    const [showNewProgramInput, setShowNewProgramInput] = useState(false);
    const [showNewTradeInput, setShowNewTradeInput] = useState(false);
    const [newProgramName, setNewProgramName] = useState('');
    const [newTradeName, setNewTradeName] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<DepartmentFormData>({
        name: '',
        code: '',
        description: '',
        head_name: '',
        contact_email: '',
        hero_image: null,
        mission: '',
        vision: '',
        facilities: [],
        programs_offered: [],
        achievements: [],
        location_details: '',
        is_active: true
    });

    const [newItems, setNewItems] = useState({
        facilities: '',
        programs_offered: '',
        achievements: ''
    });
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        if (selectedProgram) {
            fetchTrades(selectedProgram.id);
        }
    }, [selectedProgram]);

    const fetchPrograms = async () => {
        try {
            const data = await api.programs.list();
            setPrograms(data.results || data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch programs',
                variant: 'destructive'
            });
        }
    };

    const fetchTrades = async (programId: string) => {
        try {
            const data = await api.trades.list({ program_id: programId });
            setTrades(data.results || data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch trades',
                variant: 'destructive'
            });
        }
    };

    const handleProgramSelect = (program: Program) => {
        setSelectedProgram(program);
        setStep(2);
    };

    const handleCreateNewProgram = async () => {
        if (!newProgramName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a program name',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        try {
            const newProgram = await api.programs.create({
                name: newProgramName,
                code: newProgramName.toUpperCase().replace(/\s+/g, '_'),
                is_predefined: false,
                is_active: true
            });
            setSelectedProgram(newProgram);
            setNewProgramName('');
            setShowNewProgramInput(false);
            setStep(2);
            fetchPrograms();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create program',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTradeSelect = (trade: Trade) => {
        setSelectedTrade(trade);
        setIsDirectBranch(false);
        setStep(3);
    };

    const handleDirectBranch = () => {
        setSelectedTrade(null);
        setIsDirectBranch(true);
        setStep(3);
    };

    const handleCreateNewTrade = async () => {
        if (!newTradeName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a trade name',
                variant: 'destructive'
            });
            return;
        }

        if (!selectedProgram) return;

        setLoading(true);
        try {
            const newTrade = await api.trades.create({
                name: newTradeName,
                code: newTradeName.toUpperCase().replace(/\s+/g, '_'),
                program: selectedProgram.id,
                is_predefined: false,
                is_active: true
            });
            setSelectedTrade(newTrade);
            setNewTradeName('');
            setShowNewTradeInput(false);
            setIsDirectBranch(false);
            setStep(3);
            fetchTrades(selectedProgram.id);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create trade',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const addItemToArray = (field: 'facilities' | 'programs_offered' | 'achievements') => {
        const value = newItems[field];
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setNewItems(prev => ({ ...prev, [field]: '' }));
        }
    };

    const removeItemFromArray = (field: 'facilities' | 'programs_offered' | 'achievements', item: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(i => i !== item)
        }));
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, hero_image: file }));
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGalleryFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProgram) {
            toast({
                title: 'Error',
                description: 'Please select a program',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();

            // Add hierarchy fields
            submitData.append('program', selectedProgram.id);
            if (selectedTrade) {
                submitData.append('trade', selectedTrade.id);
            }
            submitData.append('is_direct_branch', isDirectBranch.toString());

            // Add text fields
            submitData.append('name', formData.name);
            submitData.append('code', formData.code);
            submitData.append('description', formData.description);
            submitData.append('head_name', formData.head_name);
            submitData.append('contact_email', formData.contact_email);
            submitData.append('mission', formData.mission);
            submitData.append('vision', formData.vision);
            submitData.append('location_details', formData.location_details);
            submitData.append('is_active', formData.is_active.toString());

            // Add JSON arrays
            submitData.append('facilities', JSON.stringify(formData.facilities));
            submitData.append('programs_offered', JSON.stringify(formData.programs_offered));
            submitData.append('achievements', JSON.stringify(formData.achievements));

            // Add hero image if selected
            if (formData.hero_image) {
                submitData.append('hero_image', formData.hero_image);
            }

            if (editingDept) {
                await api.departments.update(editingDept.id, submitData);
                toast({ title: 'Success', description: 'Department updated successfully' });
            } else {
                const createdDept = await api.departments.create(submitData);
                toast({ title: 'Success', description: 'Department created successfully' });

                // Upload gallery images if any
                if (selectedGalleryFiles && selectedGalleryFiles.length > 0 && createdDept.id) {
                    for (let i = 0; i < selectedGalleryFiles.length; i++) {
                        const file = selectedGalleryFiles[i];
                        const galleryData = new FormData();
                        const isVideo = file.type.startsWith('video/');

                        galleryData.append('department', createdDept.id);
                        galleryData.append('media_type', isVideo ? 'video' : 'image');
                        galleryData.append('display_order', i.toString());

                        if (isVideo) {
                            galleryData.append('video', file);
                        } else {
                            galleryData.append('image', file);
                        }

                        await api.departmentGalleryImages.create(galleryData);
                    }
                }
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Operation failed',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // LEVEL 1: Program Selection
    if (step === 1) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Select Program</h2>
                    <p className="text-muted-foreground">Choose a program or create a new one</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {programs.filter(p => p.is_predefined).map((program) => (
                        <Card
                            key={program.id}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleProgramSelect(program)}
                        >
                            <CardContent className="p-6 text-center">
                                <h3 className="font-semibold text-lg">{program.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!showNewProgramInput ? (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowNewProgramInput(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Program
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <Label>New Program Name</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newProgramName}
                                onChange={(e) => setNewProgramName(e.target.value)}
                                placeholder="Enter program name (e.g., Diploma)"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateNewProgram()}
                            />
                            <Button onClick={handleCreateNewProgram} disabled={loading}>
                                Create
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowNewProgramInput(false);
                                    setNewProgramName('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                <Button variant="outline" onClick={onClose} className="w-full">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to List
                </Button>
            </div>
        );
    }

    // LEVEL 2: Trade Selection
    if (step === 2 && selectedProgram) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="text-sm text-muted-foreground mb-2">
                        {selectedProgram.name} &gt; Select Trade
                    </div>
                    <h2 className="text-2xl font-bold">Select Trade</h2>
                    <p className="text-muted-foreground">Choose a trade or add directly as a branch</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trades.filter(t => t.is_predefined).map((trade) => (
                        <Card
                            key={trade.id}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleTradeSelect(trade)}
                        >
                            <CardContent className="p-6 text-center">
                                <h3 className="font-semibold text-lg">{trade.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!showNewTradeInput ? (
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowNewTradeInput(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Trade
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleDirectBranch}
                        >
                            Directly Add Branch (No Trade)
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>New Trade Name</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTradeName}
                                onChange={(e) => setNewTradeName(e.target.value)}
                                placeholder="Enter trade name (e.g., B.Arch, BCA)"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTrade()}
                            />
                            <Button onClick={handleCreateNewTrade} disabled={loading}>
                                Create
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowNewTradeInput(false);
                                    setNewTradeName('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>
        );
    }

    // LEVEL 3: Department Details Form
    if (step === 3 && selectedProgram) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="text-sm text-muted-foreground mb-2">
                        {selectedProgram.name} &gt; {selectedTrade ? selectedTrade.name : 'Direct Branch'} &gt; Department Details
                    </div>
                    <h2 className="text-2xl font-bold">Department Details</h2>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="font-semibold">Program:</span> {selectedProgram.name}
                        </div>
                        <div>
                            <span className="font-semibold">Trade:</span> {selectedTrade ? selectedTrade.name : 'Direct Branch'}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Department Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Department Code *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="head_name">Department Head</Label>
                            <Input
                                id="head_name"
                                value={formData.head_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, head_name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mission">Mission</Label>
                            <Textarea
                                id="mission"
                                value={formData.mission}
                                onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vision">Vision</Label>
                            <Textarea
                                id="vision"
                                value={formData.vision}
                                onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_image">Hero Image</Label>
                        <Input
                            id="hero_image"
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_details">Location Details</Label>
                        <Input
                            id="location_details"
                            value={formData.location_details}
                            onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
                        />
                    </div>

                    {/* Dynamic Arrays */}
                    {['facilities', 'programs_offered', 'achievements'].map((field) => (
                        <div key={field} className="space-y-2">
                            <Label>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newItems[field as keyof typeof newItems]}
                                    onChange={(e) => setNewItems(prev => ({ ...prev, [field]: e.target.value }))}
                                    placeholder={`Add ${field.replace('_', ' ')}`}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray(field as any))}
                                />
                                <Button type="button" onClick={() => addItemToArray(field as any)} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(formData[field as keyof typeof formData] as string[]).map((item: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {item}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeItemFromArray(field as any, item)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Gallery Images */}
                    <div className="space-y-2">
                        <Label>Gallery Images & Videos</Label>
                        <Input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleGalleryImagesChange}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return null;
}
