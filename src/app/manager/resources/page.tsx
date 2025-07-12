
import { getAllResourceRequests } from '@/app/actions/resourceRequests';
import { getEmployees } from '@/app/actions/employees';
import type { Employee, ResourceRequest } from '@/lib/data';
import { ManagerResourcesContent } from './_components/manager-resources-content';

export default async function ManagerResourcesPage() {
    const [requests, employees] = await Promise.all([
        getAllResourceRequests(),
        getEmployees(),
    ]);

    return (
        <ManagerResourcesContent
            initialRequests={requests as ResourceRequest[]}
            employees={employees as Employee[]}
        />
    );
}
