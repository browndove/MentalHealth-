
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { type Appointment } from '../dashboard/AppointmentCard';

interface AppointmentsChartProps {
  data: Appointment[];
}

export function AppointmentsChart({ data }: AppointmentsChartProps) {
  const chartData = useMemo(() => {
    // Group appointments by date
    const groupedData = data.reduce((acc, appointment) => {
      const date = format(parseISO(appointment.date), 'MMM dd');
      if (!acc[date]) {
        acc[date] = { date, Confirmed: 0, Pending: 0, Completed: 0 };
      }
      if (['Confirmed', 'Pending', 'Completed'].includes(appointment.status)) {
         acc[date][appointment.status as 'Confirmed' | 'Pending' | 'Completed']++;
      }
      return acc;
    }, {} as Record<string, { date: string; Confirmed: number; Pending: number; Completed: number; }>);

    // Sort by date and take the last 7 days of activity
    return Object.values(groupedData)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend iconType="circle" />
        <Bar dataKey="Pending" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Confirmed" stackId="a" fill="hsl(var(--chart-1))" />
        <Bar dataKey="Completed" stackId="a" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
