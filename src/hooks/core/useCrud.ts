import BaseEntity from '@/models/api/core/_BaseEntity'
import AbstractService, {
  CreateParams,
  DeleteParams,
  FindByIdParams,
  FindBy,
  UpdateParams,
  RestoreParams,
} from '@/models/api/core/AbstractService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseCrudOptions<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  onUnauthorized?: () => void
  onForbidden?: () => void
}

export default function useCrud<Entity extends BaseEntity>({
  onForbidden,
  onUnauthorized,
  service,
  queryKey = 'list',
}: UseCrudOptions<Entity>) {
  const queryClient = useQueryClient()

  const normalizedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey]

  const createMutation = useMutation({
    mutationFn: (params: CreateParams<Entity>) =>
      service.create({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const updateMutation = useMutation({
    mutationFn: (params: UpdateParams<Entity>) =>
      service.update({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const deleteMutation = useMutation({
    mutationFn: (params: DeleteParams) =>
      service.delete({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const restoreMutation = useMutation({
    mutationFn: (params: RestoreParams) =>
      service.restore({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const useFindById = (params: FindByIdParams) => {
    return useQuery({
      queryKey: [queryKey, params.id],
      queryFn: () =>
        service.findById({
          ...params,
          config: {
            ...params.config,
            onForbidden: onForbidden ?? params.onForbidden,
            onUnauthorized: onUnauthorized ?? params.onUnauthorized,
          },
        }),
      enabled: !!params.id,
    })
  }

  const useFindBy = (
    params: FindBy & { onUnauthorized?: () => void; onForbidden?: () => void }
  ) => {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () =>
        service.findBy({
          ...params,
          config: {
            ...params.config,
            onForbidden: onForbidden ?? params.onForbidden,
            onUnauthorized: onUnauthorized ?? params.onUnauthorized,
          },
        }),
      enabled: !!params,
    })
  }

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRestoring: deleteMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    restoreError: restoreMutation.error,

    useFindById,
    useFindByPath: useFindBy,
  }
}
