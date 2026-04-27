import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  type: string;
  isActive: boolean;
  createdAt: string;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

// Announcements Hooks
export const useListAnnouncements = () => {
  return useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    queryFn: () => customFetch<Announcement[]>("/api/announcements", { method: "GET" }),
  });
};

export const useAdminListAnnouncements = () => {
  return useQuery<Announcement[]>({
    queryKey: ["/api/admin/announcements"],
    queryFn: () => customFetch<Announcement[]>("/api/admin/announcements", { method: "GET" }),
  });
};

export const useCreateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AnnouncementInput) => 
      customFetch<Announcement>("/api/admin/announcements", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/announcements"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AnnouncementInput> }) => 
      customFetch<Announcement>(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/announcements"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      customFetch(`/api/admin/announcements/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/announcements"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
  });
};

// BK-ID CRUD Extensions
export const useUpdateBkidMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      customFetch(`/api/bkid/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/bkid"] });
    },
  });
};

export const useDeleteBkidMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      customFetch(`/api/bkid/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/bkid"] });
    },
  });
};
