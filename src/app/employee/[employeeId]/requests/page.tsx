
import connectDB from '@/lib/mongoose';
import EmployeeModel from '@/models/Employee';
import { notFound } from 'next/navigation';
import { getResourceRequestsForEmployee } from '@/app/actions/resourceRequests';
import { EmployeeRequestsContent } from './_components/employee-requests-content';
import type { Employee, ResourceRequest } from '@/lib/data';

async function getEmployeeAndRequests(employeeId: string) {
    await connectDB();
    const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
    if (!employee) {
        return null;
    }
    const requests = await getResourceRequestsForEmployee(employeeId);
    return {
        employee: JSON.parse(JSON.stringify(employee)) as Employee,
        requests: JSON.parse(JSON.stringify(requests)) as ResourceRequest[],
    };
}


export default async function EmployeeRequestsPage({ params }: { params: { employeeId: string } }) {
    const data = await getEmployeeAndRequests(params.employeeId);

    if (!data) {
        notFound();
    }
    
    const { employee, requests } = data;

    return <EmployeeRequestsContent initialRequests={requests} employee={employee} />;
}
