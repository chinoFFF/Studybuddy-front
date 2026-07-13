import { apiClient } from '../api/client';
import type {
  OrganizationCreatePayload,
  OrganizationInvitationPayload,
  OrganizationInvitationResponse,
  OrganizationResponse,
  OrganizationUpdatePayload,
} from '../types/organization';

export const organizationService = {
  listOrganizations: async (): Promise<OrganizationResponse[]> => {
    const { data } = await apiClient.get<OrganizationResponse[]>('/organizations/');
    return data;
  },

  createOrganization: async (payload: OrganizationCreatePayload): Promise<OrganizationResponse> => {
    const { data } = await apiClient.post<OrganizationResponse>('/organizations/', payload);
    return data;
  },

  updateOrganization: async (id: string, payload: OrganizationUpdatePayload): Promise<OrganizationResponse> => {
    const { data } = await apiClient.put<OrganizationResponse>(`/organizations/${id}`, payload);
    return data;
  },

  createInvitation: async (orgId: string, payload: OrganizationInvitationPayload): Promise<OrganizationInvitationResponse> => {
    const { data } = await apiClient.post<OrganizationInvitationResponse>(`/organizations/${orgId}/invitations`, payload);
    return data;
  },

  acceptInvitation: async (payload: { token: string; user_id: string }): Promise<{ message: string; organization_id: string; role_granted: string }> => {
    const { data } = await apiClient.post('/organizations/invitations/accept', payload);
    return data;
  },
};
