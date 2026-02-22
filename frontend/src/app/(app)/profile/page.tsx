"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { authApi } from "@/lib/api";
import { User, UserProfile } from "@/types";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { User as UserIcon, Mail, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authApi.getMe();
      setProfile(data);
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
      });
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const updated = await authApi.updateMe(form);
      setProfile(updated);
      await fetchUser();
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spinner className="mt-20" />;
  if (!profile) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <Input
            label="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button
          onClick={handleSave}
          isLoading={isSaving}
          className="w-full mt-6"
        >
          Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Account</h2>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            Member since:{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
          <p>
            Account type: {profile.is_provider ? "Provider" : "Customer"}
          </p>
        </div>
      </div>
    </div>
  );
}
