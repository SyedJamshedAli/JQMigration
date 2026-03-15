'use client';

import { ActiveCases } from './components/active-cases';
import { MembersTeamsRoles } from './components/members-teams-roles';
import { MyBalance } from './components/my-balance';
import { PendingTasks } from './components/pending-tasks';

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
        <ActiveCases />
        <PendingTasks />
        <MembersTeamsRoles />
        <MyBalance />
      </div>
    </div>
  );
}
