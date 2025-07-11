'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reports, employees } from "@/lib/data";

export default function ReportsPage() {
  const getEmployeeName = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)?.name || 'Unknown Employee';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Team Reports</h1>
          <p className="text-muted-foreground">
            Review submitted reports from your team.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Reports</CardTitle>
          <CardDescription>Click on a report to view its content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {reports.map((report) => (
              <AccordionItem value={report.id} key={report.id}>
                <AccordionTrigger>
                  <div className='flex justify-between w-full pr-4'>
                    <span>Report from {getEmployeeName(report.employeeId)}</span>
                    <span className='text-muted-foreground font-normal'>{report.date}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                  {report.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
