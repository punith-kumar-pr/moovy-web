import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/features/admin/admin-api";
import { formatDate, getInitials } from "@/lib/utils";

export function AdminPage() {
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: number; roles: string[] }) => adminApi.assignRoles(userId, roles),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("Roles updated"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const deactivateMutation = useMutation({
    mutationFn: adminApi.deactivateUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("User deactivated"); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const toggleRole = (userId: number, currentRoles: string[], role: string) => {
    const roleKey = role === "ROLE_ADMIN" ? "admin" : role === "ROLE_MODERATOR" ? "mod" : "user";
    const hasRole = currentRoles.includes(role);
    let newRoles: string[];
    if (hasRole) {
      newRoles = currentRoles.filter((r) => r !== role).map((r) => r === "ROLE_ADMIN" ? "admin" : r === "ROLE_MODERATOR" ? "mod" : "user");
    } else {
      newRoles = [...currentRoles, role].map((r) => r === "ROLE_ADMIN" ? "admin" : r === "ROLE_MODERATOR" ? "mod" : "user");
    }
    if (newRoles.length === 0) newRoles = ["user"];
    roleMutation.mutate({ userId, roles: newRoles });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and roles • {users?.length || 0} users</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 max-w-4xl">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {users?.map((user) => (
            <Card key={user.userId} className="group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName} <span className="text-muted-foreground font-normal">@{user.username}</span></p>
                      <p className="text-xs text-muted-foreground">{user.email} • Joined {formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"].map((role) => (
                      <Badge
                        key={role}
                        variant={user.roles.includes(role) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleRole(user.userId, user.roles, role)}
                      >
                        {role.replace("ROLE_", "")}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deactivateMutation.mutate(user.userId)}>
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
