import { useMutation } from '@tanstack/react-query'
import { askSimpleBot } from '../services'

export const useAskSimpleBot = () => useMutation({ mutationFn: askSimpleBot })
