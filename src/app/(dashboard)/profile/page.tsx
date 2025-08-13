"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

type ProfileData = {
  id: string;
  full_name: string | null;
  email: string;
  dob: Date | null;
  student_id: string | null;
  avatar_index: number;
};

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  useEffect(()=>{
    fetchData();
  },[])


  const fetchData = async () => {
    try{
      const response = await fetch("/api/profile");
      if(!response.ok) throw new Error("Response not found");
      const data = await response.json();
      console.log(data)
      setProfileData(data)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Settings */}
      <Card className="lg:col-span-2 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <h2>Profile Information</h2>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>
                {profileData[0].full_name != null ?
                  profileData[0].full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join(""): "P"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Set profile name"
                value={profileData[0].full_name != null ? profileData[0].full_name : ""}
                onChange={(e) => (e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData[0].email}
                onChange={(e) =>  e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={profileData[0].student_id != null ? profileData[0].student_id : ""}
                onChange={(e) =>
                  e.target.value
                }
              />
            </div>

           <Button>Save Changes</Button>
        </div>
        </div>
      </Card>
    </div>
  );
}
