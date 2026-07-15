import { useMutation, useQuery } from '@tanstack/react-query'
import { askTutor, deleteTutorSession, getTutorMessages, getTutorSessions } from '../services'

export const useGetTutorSessions = () =>
  useQuery({ queryKey: ['tutor-sessions'], queryFn: getTutorSessions })

export const useGetTutorMessages = (sessionId?: string) =>
  useQuery({
    queryKey: ['tutor-messages', sessionId],
    queryFn: () => getTutorMessages(sessionId!),
    enabled: !!sessionId,
  })

export const useAskTutor = () => useMutation({ mutationFn: askTutor })
export const useDeleteTutorSession = () => useMutation({ mutationFn: deleteTutorSession })
