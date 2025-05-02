export const mockGroups = [
  {
    id: "g1",
    title: "Grocery Run at UTC",
    hostUserId: "u1",
    participantIds: ["u1", "u2", "u3"],
    limit: 5,
    timeout: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    meetingPoint: { latitude: 33.6419, longitude: -117.9195 }
  }
];
