"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, setUserRole } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSetAdmin = async () => {
    if (!user?.id) return;
    setUpdating(true);
    const success = await setUserRole(user.id, "admin");
    if (success) {
      // Refresh user data
      const userData = await getCurrentUser();
      setUser(userData);
    }
    setUpdating(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify(user, null, 2)}
      </pre>
      {user && user.role !== "admin" && (
        <Button onClick={handleSetAdmin} disabled={updating}>
          {updating ? "Setting..." : "Set as Admin"}
        </Button>
      )}
    </div>
  );
}
