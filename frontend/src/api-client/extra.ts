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

export interface TrackUpdateInput {
  title: string;
  artist?: string | null;
  url: string;
  durationSec?: number | null;
}

export const useUpdateTrackItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrackUpdateInput }) =>
      customFetch(`/api/tracks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/tracks"] });
    },
  });
};

export interface RecoverBkidInput {
  name: string;
  email: string;
}

export interface RecoverBkidMember {
  id: number;
  serial: string;
  supporterNumber?: number | null;
  name: string;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: string;
}

export const useRecoverBkidMember = () => {
  return useMutation({
    mutationFn: (data: RecoverBkidInput) =>
      customFetch<RecoverBkidMember>("/api/bkid/recover", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
  });
};

export interface RecruitmentApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  instrument?: string | null;
  mediaUrl: string;
  message?: string | null;
  status: "pending" | "reviewing" | "shortlisted" | "rejected";
  createdAt: string;
  reviewedAt?: string | null;
}

export interface RecruitmentApplicationInput {
  name: string;
  email: string;
  phone: string;
  instrument?: string | null;
  mediaUrl: string;
  message?: string | null;
}

export const useSubmitRecruitmentApplication = () => {
  return useMutation({
    mutationFn: (data: RecruitmentApplicationInput) =>
      customFetch<RecruitmentApplication>("/api/recruitment-applications", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
  });
};

export const useAdminListRecruitmentApplications = () => {
  return useQuery<RecruitmentApplication[]>({
    queryKey: ["/api/admin/recruitment-applications"],
    queryFn: () =>
      customFetch<RecruitmentApplication[]>("/api/admin/recruitment-applications", {
        method: "GET",
      }),
  });
};

export const useUpdateRecruitmentApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: RecruitmentApplication["status"];
    }) =>
      customFetch<RecruitmentApplication>(`/api/admin/recruitment-applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/recruitment-applications"] });
    },
  });
};

export const useDeleteRecruitmentApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customFetch(`/api/admin/recruitment-applications/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/recruitment-applications"] });
    },
  });
};

export type VaultAssetType = "setlist_pdf" | "backstage_photo" | "wallpaper";

export interface VaultAsset {
  id: number;
  assetType: VaultAssetType;
  title: string;
  description?: string | null;
  fileUrl: string;
  previewUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface VaultAccessResponse {
  ok: true;
  member: { id: number; serial: string; name: string };
  assets: VaultAsset[];
}

export interface VaultAssetInput {
  assetType: VaultAssetType;
  title: string;
  description?: string | null;
  fileUrl: string;
  previewUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export const useVaultAccess = () => {
  return useMutation({
    mutationFn: (serial: string) =>
      customFetch<VaultAccessResponse>("/api/vault/access", {
        method: "POST",
        body: JSON.stringify({ serial }),
        headers: { "Content-Type": "application/json" },
      }),
  });
};

export const useAdminListVaultAssets = () => {
  return useQuery<VaultAsset[]>({
    queryKey: ["/api/admin/vault-assets"],
    queryFn: () => customFetch<VaultAsset[]>("/api/admin/vault-assets", { method: "GET" }),
  });
};

export const useCreateVaultAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VaultAssetInput) =>
      customFetch<VaultAsset>("/api/admin/vault-assets", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/vault-assets"] });
    },
  });
};

export const useUpdateVaultAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VaultAssetInput> }) =>
      customFetch<VaultAsset>(`/api/admin/vault-assets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/vault-assets"] });
    },
  });
};

export const useDeleteVaultAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customFetch(`/api/admin/vault-assets/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/vault-assets"] });
    },
  });
};

export interface PressKit {
  id: number;
  bioShort: string;
  technicalRider: string;
  photoUrls: string[];
  updatedAt: string;
}

export interface PressKitInput {
  bioShort: string;
  technicalRider: string;
  photoUrls: string[];
}

export const useGetPressKit = () => {
  return useQuery<PressKit>({
    queryKey: ["/api/press-kit"],
    queryFn: () => customFetch<PressKit>("/api/press-kit", { method: "GET" }),
  });
};

export const useUpdatePressKit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PressKitInput) =>
      customFetch<PressKit>("/api/admin/press-kit", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/press-kit"] });
    },
  });
};
