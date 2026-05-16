import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { profileApi } from "@/features/profile/profile-api";
import { formatDate, getInitials } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  gender: z.string().optional(),
  dob: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Min 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

const contactSchema = z.object({
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  mobile: z.string().optional(),
});

export function ProfilePage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "contact">("profile");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });

  const profileForm = useForm({ resolver: zodResolver(profileSchema), values: profile ? { firstName: profile.firstName || "", lastName: profile.lastName || "", gender: profile.gender || "", dob: profile.dob || "" } : undefined });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });
  const contactForm = useForm({ resolver: zodResolver(contactSchema), values: profile ? { email: profile.email || "", mobile: profile.mobile || "" } : undefined });

  const profileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Profile updated"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Update failed"),
  });

  const passwordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => { passwordForm.reset(); toast.success("Password changed"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const contactMutation = useMutation({
    mutationFn: profileApi.changeContact,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Contact updated"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  if (isLoading) return <div className="container py-8 max-w-2xl space-y-4"><Skeleton className="h-32 w-full rounded-lg" /><Skeleton className="h-64 w-full rounded-lg" /></div>;

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: <User className="h-4 w-4" /> },
    { key: "password" as const, label: "Password", icon: <Lock className="h-4 w-4" /> },
    { key: "contact" as const, label: "Contact", icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <div className="container py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          {getInitials(profile?.firstName, profile?.lastName)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile?.firstName} {profile?.lastName}</h1>
          <p className="text-muted-foreground">@{profile?.username} • Member since {formatDate(profile?.createdAt)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your profile details</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input {...profileForm.register("firstName")} />
                  {profileForm.formState.errors.firstName && <p className="text-xs text-destructive">{profileForm.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...profileForm.register("lastName")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select {...profileForm.register("gender")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" {...profileForm.register("dob")} />
                </div>
              </div>
              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <Card>
          <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Update your account password</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit((d) => passwordMutation.mutate({ currentPassword: d.currentPassword, newPassword: d.newPassword }))} className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" {...passwordForm.register("currentPassword")} />{passwordForm.formState.errors.currentPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}</div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" {...passwordForm.register("newPassword")} />{passwordForm.formState.errors.newPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}</div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" {...passwordForm.register("confirmPassword")} />{passwordForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}</div>
              <Button type="submit" disabled={passwordMutation.isPending}>{passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change Password</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Update your email and phone</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={contactForm.handleSubmit((d) => contactMutation.mutate({ email: d.email || undefined, mobile: d.mobile || undefined }))} className="space-y-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" {...contactForm.register("email")} /></div>
              <div className="space-y-2"><Label>Mobile</Label><Input type="tel" placeholder="+919876543210" {...contactForm.register("mobile")} /></div>
              <Button type="submit" disabled={contactMutation.isPending}>{contactMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Contact</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
