import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Bella Vista Bistro",
    owner: "John Doe",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantInfo({
      ...restaurantInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/restaurant/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantInfo)
      });

      if (!response.ok) throw new Error("Failed to update");
      alert("Changes saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Restaurant Settings</h2>

      <Card className="card-glass border-0">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Restaurant Name</Label>
              <Input 
                name="name"
                value={restaurantInfo.name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter restaurant name"
              />
            </div>
            <div>
              <Label className="text-foreground">Owner Name</Label>
              <Input 
                name="owner"
                value={restaurantInfo.owner}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter owner name"
              />
            </div>
          </div>
          <HeroButton onClick={handleSave}>Save Changes</HeroButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
