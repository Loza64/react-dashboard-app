// Generouted, changes to this file will be overridden

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `*`
  | `/`
  | `/dashboard`
  | `/dashboard/permissions`
  | `/dashboard/roles`
  | `/dashboard/settings`
  | `/dashboard/users`
  | `/login`
  | `/signup`
  | `/unauthorized`

export type Params = {
  '/*': { '*': string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>()
export const { redirect } = utils<Path, Params>()
