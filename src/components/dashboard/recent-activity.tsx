"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const recentActivity = [
  {
    id: '1',
    user: 'John Doe',
    email: 'john@example.com',
    action: 'New Order',
    amount: '$129.99',
    status: 'completed',
    time: '2 minutes ago',
  },
  {
    id: '2',
    user: 'Jane Smith',
    email: 'jane@example.com',
    action: 'Profile Update',
    amount: '-',
    status: 'pending',
    time: '5 minutes ago',
  },
  {
    id: '3',
    user: 'Mike Johnson',
    email: 'mike@example.com',
    action: 'New Order',
    amount: '$79.99',
    status: 'completed',
    time: '10 minutes ago',
  },
  {
    id: '4',
    user: 'Sarah Wilson',
    email: 'sarah@example.com',
    action: 'Refund Request',
    amount: '$199.99',
    status: 'processing',
    time: '15 minutes ago',
  },
  {
    id: '5',
    user: 'Tom Brown',
    email: 'tom@example.com',
    action: 'New Order',
    amount: '$299.99',
    status: 'completed',
    time: '20 minutes ago',
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge variant="default">Completed</Badge>;
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'processing':
      return <Badge variant="outline">Processing</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatar-${activity.id}.png`} />
                      <AvatarFallback>
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{getStatusBadge(activity.status)}</TableCell>
                <TableCell className="font-medium">{activity.amount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {activity.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}