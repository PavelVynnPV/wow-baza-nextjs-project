"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Package, Key, Upload } from "lucide-react";

export default function ProfileClient({
  user,
  profile,
  orders,
}: {
  user: any;
  profile: any;
  orders: any[];
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "password">(
    "profile",
  );
  const [username, setUsername] = useState(profile?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleSaveProfile = async () => {
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ username, avatar_url: avatarUrl })
      .eq("id", user.id);
    setSaving(false);
    router.refresh();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${user.id}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    console.log("upload error:", error);

    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      console.log("public url:", data.publicUrl);
      setAvatarUrl(data.publicUrl);
    }

    setUploading(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    await supabase.auth.updateUser({ password: newPassword });
    setNewPassword("");
    alert("Password changed successfully! ✅");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure? This action cannot be undone! All your data will be deleted.",
    );
    if (!confirmed) return;

    const res = await fetch("/api/delete-account", { method: "DELETE" });

    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      alert("Error deleting account. Please try again.");
    }
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    done: "bg-green-500/20 text-green-400",
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "Orders", icon: Package },
    { key: "password", label: "Password", icon: Key },
  ];

  const inputClass =
    "bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40 w-full";

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10 text-white mb-[100px]">
      <div className="flex items-center justify-center">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#FF9500]/30 flex items-center justify-center">
              <User className="w-10 h-10 text-[#FF9500]" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-[#FF9500] rounded-full p-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{username || "User"}</h1>
          <p className="text-white/50 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-[70px] mt-[30px] justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 pb-3 text-[12px] md:text-sm font-semibold cursor-pointer transition-all border-b-2 ${
              activeTab === tab.key
                ? "border-[#FF9500] text-[#FF9500]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-4 max-w-[500px] justify-center mx-auto">
          <div>
            <label className="text-white/50 text-sm mb-1 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="Your nickname"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-1 block">Email</label>
            <input
              value={user.email}
              disabled
              className={`${inputClass} opacity-50`}
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              id="avatar-upload"
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-[#FF9500] px-4 py-2 rounded-lg text-white text-sm"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </label>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer disabled:opacity-50 w-full"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full mt-4 bg-red-500/20 hover:bg-red-500/40 transition-all rounded-lg py-3 font-bold text-white cursor-pointer border border-red-500/20"
          >
            Delete Account
          </button>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <p className="text-white/50">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#2F292D] rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">
                      Order #{order.id}
                    </p>
                    <p className="text-white/50 text-sm">
                      Nickname: {order.nickname}
                    </p>
                    <p className="text-white/50 text-sm">
                      Amount: {order.amount}
                    </p>
                    <p className="text-white/50 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] ?? "bg-white/10 text-white"}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-white font-bold">$ {order.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Password tab */}
      {activeTab === "password" && (
        <div className="flex flex-col gap-4 max-w-[500px] mx-auto">
          <div>
            <label className="text-white/50 text-sm mb-1 block">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="New password"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
}
