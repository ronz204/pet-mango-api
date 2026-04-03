export namespace RepoArgs {
  export interface Details {
    roomId: number;
  };

  export interface Exists {
    id?: number;
    name?: string;
  };

  export interface Create {
    name: string;
    ownerId: number;
  };
};
