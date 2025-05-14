export type MockUser = {
    id: string;
    name: string;
    age: number;
    nationality: string;
    major: string;
    hobbies: string[];
    location: {
      latitude: number;
      longitude: number;
    };
    activeActivityId: string | null; //Currently hosting, if yes which activity ID
    joinedGroupId: string | null; //Is it in a group or not, if yes which group
    radius: number; //
    profilePicture?: string; // Added profilePicture property
  };
  
export type Group = {
    id: string;
    title: string;
    hostUserId: string;
    participantIds: string[];
    limit: number;
    timeout: Date;
    meetingPoint: {
      latitude: number;
      longitude: number;
    };
  };
  