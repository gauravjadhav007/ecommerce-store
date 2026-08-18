"use client";

import { useEffect, useState } from "react";
import { Users, Shield, User, Mail, Calendar } from "lucide-react";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

const ROLE_OPTIONS = ["CUSTOMER", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs sm:text-sm text-gray-500 border-b border-gray-200">
                  <th className="p-3 sm:p-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Name
                    </span>
                  </th>
                  <th className="p-3 sm:p-4 hidden sm:table-cell">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                  </th>
                  <th className="p-3 sm:p-4">Role</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Orders</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Joined
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="p-3 sm:p-4">
                      <div className="font-medium text-xs sm:text-sm">{user.name || "Unnamed"}</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs sm:hidden">{user.email}</div>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm hidden md:table-cell">
                      {user._count.orders}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 sm:p-4 sm:hidden">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="text-[10px] border border-gray-300 rounded px-1.5 py-1 min-h-[32px]"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-3 sm:hidden">
          <div className="p-3 flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Tap any user row to change their role</span>
          </div>
        </div>
      )}
    </div>
  );
}
