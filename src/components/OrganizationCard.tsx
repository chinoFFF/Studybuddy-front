import React, { useState } from 'react';
import { organizationService } from '../services/organizationService';
import type { OrganizationResponse } from '../types/organization';

interface OrganizationCardProps {
  organization: OrganizationResponse;
  onUpdated?: () => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(organization.name);
  const [description, setDescription] = useState(organization.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await organizationService.updateOrganization(organization.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setIsEditing(false);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar la organización.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await organizationService.createInvitation(organization.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteMessage(`Invitación enviada a ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('member');
    } catch (err) {
      console.error(err);
      setInviteMessage('No se pudo enviar la invitación.');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {isEditing ? (
        <div className="space-y-3">
          {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Nombre de la sala"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Descripción"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{organization.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{organization.description || 'Sin descripción.'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
            >
              Editar
            </button>
          </div>

          <form onSubmit={handleInvite} className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3">
            <div className="text-sm font-medium text-gray-700">Invitar usuario</div>
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="correo@ejemplo.com"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
            <button type="submit" className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white">
              Enviar invitación
            </button>
            {inviteMessage && <p className="text-sm text-green-600">{inviteMessage}</p>}
          </form>
        </>
      )}
    </div>
  );
};
