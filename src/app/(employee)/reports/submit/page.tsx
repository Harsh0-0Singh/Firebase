'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SubmitReportPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const reportContent = formData.get('report') as string;

    if (reportContent.trim()) {
       toast({
        title: "Report Submitted!",
        description: "Your report has been successfully submitted to your manager.",
      });
      // Here you would typically send the data to a server
      console.log("Report content:", reportContent);
      (event.target as HTMLFormElement).reset();
    } else {
        toast({
        title: "Error",
        description: "Report content cannot be empty.",
        variant: "destructive"
      });
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit Your Report</CardTitle>
          <CardDescription>
            Provide a summary of your work, progress, and any blockers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="report">Your Report</Label>
            <Textarea
              id="report"
              name="report"
              placeholder="Type your report here..."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Submit Report</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
