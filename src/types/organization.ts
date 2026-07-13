// src/types/organization.ts

export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string;
  // Formato "room_<uuid>" — de aquí sale el room_id real para chat/documents.
  // OJO: no siempre coincide con el "id" de la organización, hay que usar este campo.
  tenant_id: string;
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