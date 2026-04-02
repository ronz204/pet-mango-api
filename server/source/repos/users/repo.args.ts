export namespace RepoArgs {
  export interface Exists {
    id?: number;
    name?: string;
    email?: string;
  };

  export interface Search {
    userId: number;
    name?: string;
  };

  export interface Create {
    data: {
      name: string;
      email: string;
      password: string;
    };
  };

  export interface Update {
    userId: number;
    data: {
      name?: string;
      email?: string;
      password?: string;
    };
  };
};
