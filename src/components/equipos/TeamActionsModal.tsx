'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Team, Student } from '@/types';

interface TeamActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onLeaveTeam: (teamId: string, memberId: string) => void;
  onDissolveTeam: (teamId: string) => void;
  minTeamSize: number;
}

export default function TeamActionsModal({
  isOpen,
  onClose,
  team,
  onLeaveTeam,
  onDissolveTeam,
  minTeamSize
}: TeamActionsModalProps) {
  const { user } = useAuth();
  const [action, setAction] = useState<'leave' | 'dissolve' | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !user) return null;

  const isCreator = team.creatorId === user.id;
  const currentMemberCount = team.members.length;
  const wouldBeIncomplete = currentMemberCount - 1 < minTeamSize;

  const handleLeaveTeam = async () => {
    if (confirmText !== 'ABANDONAR') return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onLeaveTeam(team.id, user.id);
      onClose();
    } catch (error) {
      console.error('Error leaving team:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDissolveTeam = async () => {
    if (confirmText !== 'DISOLVER') return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onDissolveTeam(team.id);
      onClose();
    } catch (error) {
      console.error('Error dissolving team:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setAction(null);
    setConfirmText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Gestionar Equipo
          </h3>
          <button
            onClick={resetModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!action && (
          <div className="space-y-4">
            {/* Información del equipo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{team.name}</h4>
              <p className="text-sm text-gray-600">
                Miembros: {currentMemberCount}/{3}
              </p>
              <p className="text-sm text-gray-600">
                Estado: {team.status === 'forming' ? 'En Formación' : 
                         team.status === 'active' ? 'Activo' : 'Completado'}
              </p>
              <p className="text-sm text-gray-600">
                Tu rol: {isCreator ? 'Creador' : 'Miembro'}
              </p>
            </div>

            {/* Opciones disponibles */}
            <div className="space-y-3">
              <button
                onClick={() => setAction('leave')}
                className="w-full text-left p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <div>
                    <h5 className="font-medium text-gray-900">Abandonar Equipo</h5>
                    <p className="text-sm text-gray-600">
                      Salir del equipo. Los demás miembros serán notificados.
                    </p>
                    {wouldBeIncomplete && (
                      <p className="text-sm text-orange-600 mt-1">
                        ⚠️ El equipo quedaría con menos de {minTeamSize} miembros.
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {isCreator && (
                <button
                  onClick={() => setAction('dissolve')}
                  className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <div>
                      <h5 className="font-medium text-gray-900">Disolver Equipo</h5>
                      <p className="text-sm text-gray-600">
                        Eliminar completamente el equipo. Todos los miembros serán notificados.
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {action === 'leave' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Confirmar Abandono
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>Estás a punto de abandonar el equipo "{team.name}".</p>
                    <ul className="mt-2 list-disc list-inside">
                      <li>Los demás miembros recibirán una notificación</li>
                      <li>Perderás acceso al proyecto del equipo</li>
                      {wouldBeIncomplete && (
                        <li className="text-orange-800 font-medium">
                          El equipo quedará marcado como "Incompleto"
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, escribe "ABANDONAR":
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="ABANDONAR"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setAction(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                onClick={handleLeaveTeam}
                disabled={confirmText !== 'ABANDONAR' || isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Procesando...' : 'Abandonar Equipo'}
              </button>
            </div>
          </div>
        )}

        {action === 'dissolve' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Confirmar Disolución
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Estás a punto de disolver completamente el equipo "{team.name}".</p>
                    <ul className="mt-2 list-disc list-inside">
                      <li>Todos los miembros recibirán una notificación</li>
                      <li>El equipo será eliminado permanentemente</li>
                      <li>Se perderá todo el progreso del proyecto</li>
                      <li className="font-medium">Esta acción no se puede deshacer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, escribe "DISOLVER":
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="DISOLVER"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setAction(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                onClick={handleDissolveTeam}
                disabled={confirmText !== 'DISOLVER' || isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Procesando...' : 'Disolver Equipo'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}