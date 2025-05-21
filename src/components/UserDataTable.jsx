// src/components/UserDataTable.jsx
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Shadcn UI Table

export function UserDataTable({ users }) {
  return (
    <div className="rounded-2xl overflow-x-auto border border-[#31394e] bg-[#212836] shadow-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Avatar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone ?? "--"}</TableCell>
              <TableCell>{u.birthday ? new Date(u.birthday).toLocaleDateString("vi-VN") : "--"}</TableCell>
              <TableCell>{u.gender === true ? "Nam" : u.gender === false ? "Nữ" : "--"}</TableCell>
              <TableCell>
                <span className={`font-semibold px-2 py-1 rounded 
                  ${u.role === "ADMIN"
                    ? "bg-yellow-500/80 text-[#222]"
                    : "bg-gray-600/80 text-yellow-200"}`}>
                  {u.role}
                </span>
              </TableCell>
              <TableCell>
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#ffb92c]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg text-yellow-400 font-bold border border-gray-500">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
