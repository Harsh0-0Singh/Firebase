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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { reports, employees } from "@/lib/data";
import { summarizeTeamReports } from '@/ai/flows/summarize-team-reports';
import { Loader2, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setIsDialogOpen(true);
    setSummary('');

    try {
      const reportContents = reports.map(r => r.content);
      const result = await summarizeTeamReports({ reports: reportContents });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to summarize reports:", error);
      setSummary("Sorry, there was an error generating the summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)?.name || 'Unknown Employee';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Team Reports</h1>
          <p className="text-muted-foreground">
            Review submitted reports and generate AI summaries.
          </p>
        </div>
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Summarize All Reports
        </Button>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" /> AI Generated Summary
            </DialogTitle>
            <DialogDescription>
              Here is a concise summary of all team reports.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
