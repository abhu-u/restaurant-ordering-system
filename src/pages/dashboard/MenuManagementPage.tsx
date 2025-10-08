import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroButton, GlassButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Schemas
const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required").max(50, "Section name must be less than 50 characters"),
});

const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100, "Item name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  sectionId: z.string().min(1, "Please select a section"),
  isVeg: z.boolean(),
});

const MenuManagementPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Addon management state
  const [addons, setAddons] = useState([]);
  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState("");

  // Section form
  const sectionForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: { name: "" }
  });

  // Menu item form
  const itemForm = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      sectionId: "",
      isVeg: false,
    }
  });

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Addon management functions
  const handleAddAddon = () => {
    if (!addonName.trim()) {
      toast({
        title: "Error",
        description: "Addon name is required",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(addonPrice) || 0;
    if (price < 0) {
      toast({
        title: "Error",
        description: "Addon price cannot be negative",
        variant: "destructive"
      });
      return;
    }

    setAddons([...addons, { name: addonName.trim(), price }]);
    setAddonName("");
    setAddonPrice("");
  };

  const handleRemoveAddon = (index) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  // Fetch sections
  const fetchSections = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/sections`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch sections",
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      console.error("Fetch sections error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
      return [];
    }
  }, [token, toast]);

  // Fetch menu items
  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/menuitems`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch menu items",
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      console.error("Fetch menu items error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
      return [];
    }
  }, [token, toast]);

  // Load data on component mount
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sections, menuItems] = await Promise.all([
        fetchSections(),
        fetchMenuItems()
      ]);

      // Group menu items by section
      const sectionsWithItems = sections.map(section => ({
        ...section,
        id: section._id,
        items: menuItems
          .filter(item => {
            const itemSectionId = typeof item.sectionId === 'object' ? item.sectionId._id : item.sectionId;
            return itemSectionId === section._id;
          })
          .map(item => ({
            ...item,
            id: item._id,
            sectionId: typeof item.sectionId === 'object' ? item.sectionId._id : item.sectionId,
            addons: Array.isArray(item.addons) ? item.addons : []
          }))
      }));

      setMenuSections(sectionsWithItems);
    } catch (error) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [fetchSections, fetchMenuItems, toast]);

  // Section management
  const handleAddSection = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/sections`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        const newSection = {
          ...result.data,
          id: result.data._id,
          items: []
        };
        setMenuSections([newSection, ...menuSections]);
        sectionForm.reset();
        setIsSectionDialogOpen(false);
        toast({
          title: "Success",
          description: `${data.name} section has been added successfully.`
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add section",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Add section error:", error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive"
      });
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    sectionForm.setValue("name", section.name);
    setIsSectionDialogOpen(true);
  };

  const handleUpdateSection = async (data) => {
    if (editingSection) {
      try {
        const response = await fetch(`${API_URL}/api/sections/${editingSection._id || editingSection.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
          setMenuSections(menuSections.map(section =>
            section.id === editingSection.id
              ? { ...section, name: data.name }
              : section
          ));
          sectionForm.reset();
          setEditingSection(null);
          setIsSectionDialogOpen(false);
          toast({
            title: "Success",
            description: `${data.name} section has been updated successfully.`
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update section",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Update section error:", error);
        toast({
          title: "Error",
          description: "Failed to update section",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      const response = await fetch(`${API_URL}/api/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setMenuSections(menuSections.filter(section => section.id !== sectionId));
        toast({
          title: "Success",
          description: "Section has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete section",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Delete section error:", error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive"
      });
    }
  };

  // Menu item management
  const handleAddItem = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('sectionId', data.sectionId);
      formData.append('isVeg', data.isVeg.toString());
      formData.append('addons', JSON.stringify(addons));
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch(`${API_URL}/api/menuitems`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        const newItem = {
          ...result.data,
          id: result.data._id,
          sectionId: data.sectionId,
          addons: addons
        };

        setMenuSections(menuSections.map(section =>
          section.id === data.sectionId
            ? { ...section, items: [newItem, ...section.items] }
            : section
        ));

        itemForm.reset();
        setAddons([]);
        setSelectedImage(null);
        setImagePreview(null);
        setIsItemDialogOpen(false);
        toast({
          title: "Success",
          description: `${data.name} has been added successfully.`
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add menu item",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Add menu item error:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    itemForm.setValue("name", item.name);
    itemForm.setValue("description", item.description);
    itemForm.setValue("price", item.price);
    itemForm.setValue("sectionId", item.sectionId);
    itemForm.setValue("isVeg", item.isVeg);
    setAddons(Array.isArray(item.addons) ? item.addons : []);
    
    // Set image preview if exists
    if (item.image) {
      setImagePreview(`${API_URL}${item.image}`);
    }
    
    setIsItemDialogOpen(true);
  };

  const handleUpdateItem = async (data) => {
    if (editingItem) {
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('sectionId', data.sectionId);
        formData.append('isVeg', data.isVeg.toString());
        formData.append('addons', JSON.stringify(addons));
        
        if (selectedImage) {
          formData.append('image', selectedImage);
        }

        const response = await fetch(`${API_URL}/api/menuitems/${editingItem._id || editingItem.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        console.log("Update response:", result);
        
        if (result.success) {
          const updatedItem = {
            ...result.data,
            id: result.data._id || editingItem.id,
            sectionId: data.sectionId,
            addons: addons
          };

          setMenuSections(menuSections.map(section => ({
            ...section,
            items: section.items.map(item =>
              item.id === editingItem.id ? updatedItem : item
            )
          })));

          itemForm.reset();
          setAddons([]);
          setSelectedImage(null);
          setImagePreview(null);
          setEditingItem(null);
          setIsItemDialogOpen(false);
          toast({
            title: "Success",
            description: `${data.name} has been updated successfully.`
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update menu item",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Update menu item error:", error);
        toast({
          title: "Error",
          description: "Failed to update menu item",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const response = await fetch(`${API_URL}/api/menuitems/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setMenuSections(menuSections.map(section => ({
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        })));
        toast({
          title: "Success",
          description: "Menu item has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete menu item",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Delete menu item error:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  const toggleItemActive = async (itemId) => {
    try {
      const item = menuSections
        .flatMap(section => section.items)
        .find(item => item.id === itemId);
      
      if (item) {
        const response = await fetch(`${API_URL}/api/menuitems/${itemId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...item,
            isActive: !item.isActive
          }),
        });

        const result = await response.json();
        if (result.success) {
          setMenuSections(menuSections.map(section => ({
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, isActive: !item.isActive } : item
            )
          })));
          
          toast({
            title: "Success",
            description: `Item ${item.isActive ? 'hidden' : 'shown'} successfully.`
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update item status",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Toggle item active error:", error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, loadData]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading menu data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Menu Management</h2>
        <div className="flex space-x-2">
          <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
            <DialogTrigger asChild>
              <GlassButton onClick={() => { setEditingSection(null); sectionForm.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </GlassButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
              </DialogHeader>
              <Form {...sectionForm}>
                <form onSubmit={sectionForm.handleSubmit(editingSection ? handleUpdateSection : handleAddSection)} className="space-y-4">
                  <FormField
                    control={sectionForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter section name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <HeroButton type="submit">
                      {editingSection ? "Update" : "Add"} Section
                    </HeroButton>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {menuSections.length === 0 ? (
          <Card className="card-glass border-0">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">No menu sections yet</h3>
                <p className="text-muted-foreground">Get started by creating your first menu section</p>
              </div>
              <GlassButton onClick={() => { setEditingSection(null); sectionForm.reset(); setIsSectionDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Section
              </GlassButton>
            </CardContent>
          </Card>
        ) : (
          menuSections.map((section) => (
            <Card key={section.id} className="card-glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">{section.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {section.items.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-muted-foreground">No items in this section yet</p>
                    </div>
                  ) : (
                    section.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img 
                                src={`${API_URL}${item.image}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              <div className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleItemActive(item.id)}
                              >
                                {item.isActive ? (
                                  <Eye className="h-4 w-4 text-green-500" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                            <p className="font-semibold text-primary">${item.price.toFixed(2)}</p>
                            {item.addons && item.addons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.addons.map((addon, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {addon.name} {addon.price > 0 && `(+${addon.price.toFixed(2)})`}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                  <DialogTrigger asChild>
                    <HeroButton 
                      className="w-full"
                      onClick={() => { 
                        setEditingItem(null); 
                        itemForm.reset();
                        setAddons([]);
                        setSelectedImage(null);
                        setImagePreview(null);
                        itemForm.setValue("sectionId", section.id);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Menu Item
                    </HeroButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                    </DialogHeader>
                    <Form {...itemForm}>
                      <form onSubmit={itemForm.handleSubmit(editingItem ? handleUpdateItem : handleAddItem)} className="space-y-4">
                        
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                          <FormLabel>Menu Item Image (Optional)</FormLabel>
                          
                          {imagePreview ? (
                            <div className="relative inline-block w-full">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-border mx-auto"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={itemForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter item name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={itemForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={itemForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter item description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={itemForm.control}
                            name="sectionId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {menuSections.map((section) => (
                                      <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={itemForm.control}
                            name="isVeg"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 pt-6">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="rounded border-border"
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">Vegetarian</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Addons Section */}
                        <div className="space-y-3 border-t pt-4">
                          <FormLabel>Add-ons</FormLabel>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Addon name"
                              value={addonName}
                              onChange={(e) => setAddonName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddAddon();
                                }
                              }}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={addonPrice}
                              onChange={(e) => setAddonPrice(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddAddon();
                                }
                              }}
                              className="w-32"
                            />
                            <Button type="button" onClick={handleAddAddon} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {addons.length > 0 && (
                            <div className="space-y-2">
                              {addons.map((addon, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{addon.name}</span>
                                    <Badge variant="outline">
                                      {addon.price > 0 ? `+${addon.price.toFixed(2)}` : 'Free'}
                                    </Badge>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAddon(index)}
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {addons.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No add-ons added yet</p>
                          )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => {
                            setIsItemDialogOpen(false);
                            setAddons([]);
                            setAddonName("");
                            setAddonPrice("");
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}>
                            Cancel
                          </Button>
                          <HeroButton type="submit">
                            {editingItem ? "Update" : "Add"} Item
                          </HeroButton>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuManagementPage;