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

  export interface IsMember {
    roomId: number;
    userId: number;
  };

  export interface Leave {
    roomId: number;
    userId: number;
  };

  export interface Invite {
    roomId: number;
    inviteeId: number;
  };
};
