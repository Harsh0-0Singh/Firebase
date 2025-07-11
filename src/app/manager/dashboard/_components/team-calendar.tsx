'use client';

import { useState } from 'react';
import { Task, tasks } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const clientColors: { [key: string]: string } = {
  'Innovate Corp': 'bg-blue-500',
  'Tech Solutions': 'bg-green-500',
};

export function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(parseISO(task.dueDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  }

  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button variant="outline" size="sm" onClick={handleToday}>Today</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-muted-foreground p-2 bg-card text-sm">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-muted/50" />
        ))}
        {daysInMonth.map(day => {
          const dayTasks = tasksByDate[format(day, 'yyyy-MM-dd')] || [];
          return (
            <div key={day.toString()} className={cn("bg-card p-2 min-h-[120px] relative border-t border-border", {
                "bg-primary/10": isToday(day),
            })}>
              <time dateTime={format(day, 'yyyy-MM-dd')} className={cn("font-semibold", {
                  "text-primary font-bold": isToday(day)
              })}>
                {format(day, 'd')}
              </time>
              <div className="mt-1 space-y-1">
                {dayTasks.map(task => (
                  <Link href={`/tasks/${task.id}`} key={task.id} className="block">
                     <div className="text-xs p-1.5 rounded-md bg-secondary hover:bg-secondary/80 flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", clientColors[task.client] || 'bg-gray-400')}></div>
                        <span className="truncate font-medium text-secondary-foreground">{task.title}</span>
                     </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
