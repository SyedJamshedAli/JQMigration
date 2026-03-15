// System log service stub (server-side operations handled by backend)
export interface SystemLogProps {
  userId?: string;
  event?: string;
  action?: string;
  entityId?: string;
  entityType?: string;
  description?: string;
  ipAddress?: string;
  meta?: string;
}

export async function createSystemLog(_data: SystemLogProps): Promise<void> {
  // Log actions are handled by the NestJS backend
}

export async function systemLog(_data: SystemLogProps): Promise<void> {
  // Log actions are handled by the NestJS backend
}
