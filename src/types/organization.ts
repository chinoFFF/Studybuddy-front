export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string | null;
  tenant_id: string;
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
  role: string;
}

export interface OrganizationInvitationResponse {
  id: string;
  room_id: string;
  email: string;
  token: string;
  role: string;
  expires_at: string;
  status: string;
}
