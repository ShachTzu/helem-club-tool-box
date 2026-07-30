export type PlainReport = {
  /**
   * unique identifier of the report.
   */
  id: string;

  /**
   * id of the comment being reported.
   */
  commentId: string;

  /**
   * id of the device that submitted the report.
   * used to enforce one report per device per comment.
   */
  deviceId: string;

  /**
   * ISO timestamp of when the report was created.
   */
  createdAt: string;
};

/**
 * Report entity.
 * Represents a single report of a comment, submitted by a device.
 * Only one report may exist per device per comment.
 */
export class Report {
  constructor(
    /**
     * unique identifier of the report.
     */
    readonly id: string,

    /**
     * id of the comment being reported.
     */
    readonly commentId: string,

    /**
     * id of the device that submitted the report.
     */
    readonly deviceId: string,

    /**
     * ISO timestamp of when the report was created.
     */
    readonly createdAt: string
  ) {}

  /**
   * serialize a Report into a plain object.
   */
  toObject(): PlainReport {
    return {
      id: this.id,
      commentId: this.commentId,
      deviceId: this.deviceId,
      createdAt: this.createdAt,
    };
  }

  /**
   * create a Report instance from a plain object.
   */
  static from(plainReport: PlainReport): Report {
    const {
      id = '',
      commentId = '',
      deviceId = '',
      createdAt = new Date().toISOString(),
    } = plainReport || ({} as PlainReport);

    return new Report(id, commentId, deviceId, createdAt);
  }

  /**
   * create a new Report for a given comment and device.
   */
  static create(commentId: string, deviceId: string): Report {
    return new Report(
      `${commentId}:${deviceId}`,
      commentId,
      deviceId,
      new Date().toISOString()
    );
  }
}
