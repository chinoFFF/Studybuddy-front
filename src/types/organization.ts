// src/types/organization.ts

export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationCreatePayload {
  name: string;
  description?: string;
}

export interface OrganizationUpdatePayload {
  name?: string;
  description?: string;
}

export interface OrganizationInvitationPayload {
  email: string;
  role?: string;
}

export interface OrganizationInvitationResponse {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  token?: string;
  expires_at?: string;
}