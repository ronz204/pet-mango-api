export namespace RoomArgs {
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

  export interface isMember {
    roomId: number;
    userId: number;
  };

  export interface Leave {
    roomId: number;
    userId: number;
  };
};
