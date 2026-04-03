export namespace RepoArgs {
  export interface Exists {
    id?: number;
    name?: string;
  };

  export interface Create {
    name: string;
    ownerId: number;
  };
};
