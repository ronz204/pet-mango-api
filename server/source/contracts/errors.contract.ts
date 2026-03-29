export interface ErrorArgs {
  code: string;
  message: string;
};

export abstract class MangoError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(status: number, args: ErrorArgs) {
    super(args.message);
    this.code = args.code;
    this.status = status;
  };

  public toResponse(): Response {
    return Response.json({
      code: this.code,
      message: this.message,
    }, { status: this.status });
  };
};
