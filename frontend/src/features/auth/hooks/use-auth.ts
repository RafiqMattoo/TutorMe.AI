import { useMutation, useQuery } from '@tanstack/react-query'
import { getCurrentUser, getPublicSchools, loginUser, logoutUser, registerMember, registerSchool } from '../services'

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  })

export const useGetPublicSchools = () =>
  useQuery({
    queryKey: ['public-schools'],
    queryFn: getPublicSchools,
  })

export const useLoginUser = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
  })

export const useLogoutUser = () => useMutation({ mutationFn: logoutUser })
export const useRegisterSchool = () => useMutation({ mutationFn: registerSchool })
export const useRegisterMember = () => useMutation({ mutationFn: registerMember })
