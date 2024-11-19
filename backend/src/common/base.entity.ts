export abstract class BaseEntity {
    public PK: string;
    public SK: string;
    public CREATED_AT: number;
    public UPDATED_AT: number;

    protected constructor(
        pk: string,
        sk: string,
        createdAt: number,
        updatedAt: number,
    ) {
        this.PK = pk;
        this.SK = sk;
        this.CREATED_AT = createdAt;
        this.UPDATED_AT = updatedAt;
    }

    public static readonly pkPrefix: string;
    public static readonly skPrefix: string;
    public static readonly entityType: string;

    public abstract toDynamoDbItem(): Record<string, unknown>;
}
