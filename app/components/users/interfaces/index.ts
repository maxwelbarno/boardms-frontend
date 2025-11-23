interface Role {
  id: number;
  name: string;
}

interface Picture {
  name: string;
  mimetype: string;
  data: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
  phone: string;
  status: string;
  lastLogin: string;
  picture: Picture;
}
