"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, User } from "lucide-react";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

type ProfileData = {
  id: string;
  full_name: string | null;
  email: string;
  dob: string | null;
  student_id: string | null;
  avatar_index: number;
};

export default function Profile() {
  const [readOnly, setReadOnly] = useState(true);
  const [ava, setAva] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    full_name: "",
    email: "",
    dob: "",
    student_id: "",
    avatar_index: 1,
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Response not found");
      const data = await response.json();
      console.log(data);
      setProfileData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const submitData = async () => {
    console.log(profileData);
    try {
      const response = await fetch("/api/profile",{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Response not found");
    } catch (error) {
      console.log(error);
    }
    fetchData();
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const editBtnHandle = () => {
    readOnly ? setReadOnly(false) : setReadOnly(true);
  };
  const setAvatar = (id: number) => {
    console.log(id);
    profileData.avatar_index = id;
  };

  const avatars = [
    "/assets/images/1.jpg",
    "/assets/images/2.jpg",
    "/assets/images/3.jpg",
    "/assets/images/4.jpg",
    "/assets/images/5.jpg",
    "/assets/images/6.jpg",
    "/assets/images/7.jpg",
    "/assets/images/8.jpg",
    "/assets/images/9.jpg",
    "/assets/images/10.jpg",
  ];

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
              <AvatarImage
                src={avatars[profileData.avatar_index - 1]}
                alt="User Avatar"
              />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="flex justify-between w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={readOnly} size="sm">
                    Change Photo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      <RadioGroup
                        defaultValue={`${profileData.avatar_index}`}
                        className="grid grid-cols-3 md:grid-cols-5"
                      >
                        {avatars.map((item, index) => {
                          return (
                            <div
                              key={index + 1}
                              className="flex items-center space-x-2 has-data-[state=checked]:ring-4 has-data-[state=checked]:ring-primary h-20 w-20 rounded-full"
                            >
                              <RadioGroupItem
                                value={`${index + 1}`}
                                id={`${index + 1}`}
                                className="sr-only"
                              />
                              <Label
                                onClick={() => setAva(index + 1)}
                                htmlFor={`${index + 1}`}
                              >
                                <Avatar className="h-20 w-20 ">
                                  <AvatarImage src={item} alt="User Avatar" />
                                  <AvatarFallback>AT</AvatarFallback>
                                </Avatar>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button variant="default" onClick={() => setAvatar(ava)}>
                      Set
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={editBtnHandle} variant="outline" size="sm">
                <Pencil />
                Edit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Set profile name"
                value={profileData.full_name ?? ""}
                onChange={handleChange}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={profileData.student_id ?? ""}
                onChange={handleChange}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileData.dob ?? ""}
                onChange={handleChange}
                disabled={readOnly}
              />
            </div>

            <Button disabled={readOnly} onClick={submitData}>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
