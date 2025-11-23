interface Committe {
  id: number;
  name: string;
}

interface MeetingFormData {
  name: string;
  type: string;
  location: string;
  chairId: string;
  status?: string;
  description?: string;
  period?: string;
  color?: string;
  startAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  roleName: string;
}

interface Committee {
  id: number;
  name: string;
}

interface Ministry {
  id: number;
  name: string;
  acronym: string;
}

interface Agenda {
  id: number;
  title: string;
  description: string;
  status: string;
  coSponsors?: Array<Ministry>;
  createdAt: string;
  updatedAt: string;
  ministry: Ministry;
}

interface Meeting {
  id: number;
  name: string;
  type: string;
  startAt: string;
  location: string;
  status: string;
  description: string;
  period: string;
  actualEnd: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  committee: Committee;
  agenda?: Array<Agenda>;
  chairId: number;
  approvedBy: number;
  createdBy: number;
  committeeId: number;
  chair: User;
}

interface Ministry {
  id: number;
  name: string;
  acronym: string;
}

interface Agenda {
  id: number;
  title: string;
  description: string;
  status: string;
  coSponsors?: Array<Ministry>;
  createdAt: string;
  updatedAt: string;
  ministry: Ministry;
}

interface MeetingComponentProps {
  meetingId: string;
}

interface DetailsProps {
  meeting: Meeting | null;
}

interface MeetingsToday {
  [key: string]: Meeting[];
}

interface GroupedMeetings {
  [key: string]: Meeting[];
}
