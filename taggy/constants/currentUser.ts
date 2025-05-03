import type { MockUser } from '../types/models';

export const currentUser: MockUser = {
  id: "me",
  name: "Ian Shimabukuro",
  age: 24,
  nationality: "Brazil",
  major: "Engineering",
  hobbies: ["design", "coding", "matcha"],
  location: {
    latitude: 33.64637343340951,
    longitude: -117.84285188835815,
  },
  activeActivityId: null,
  joinedGroupId: null,
  radius: 500,
};
