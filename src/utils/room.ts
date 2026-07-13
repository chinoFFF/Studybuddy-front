// src/utils/room.ts

/**
 * El backend devuelve tenant_id con el formato "room_<uuid>".
 * Este es el room_id real que hay que mandar a /chat/sessions y /documents/,
 * NO el "id" de la organización (a veces coinciden, pero no siempre).
 */
export const getRoomIdFromOrganization = (tenantId: string): string => {
  return tenantId.replace(/^room_/, '');
};