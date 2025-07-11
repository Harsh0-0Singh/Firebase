import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 border rounded-full bg-primary/10 border-primary/20">
              <Globe
                className="w-10 h-10 text-primary"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">
            Welcome to Brands in House
          </CardTitle>
          <CardDescription>
            Your integrated platform for seamless collaboration.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Link href="/manager/dashboard" passHref>
            <Button className="w-full" size="lg">
              Login as Manager
            </Button>
          </Link>
          <Link href="/employee/dashboard" passHref>
            <Button className="w-full" variant="secondary" size="lg">
              Login as Employee
            </Button>
          </Link>
          <Link href="/clients/1" passHref>
            <Button className="w-full" variant="ghost" size="lg">
              View Client Portal
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
