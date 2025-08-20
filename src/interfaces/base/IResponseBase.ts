
export interface IResponseBase {
    status: number;
    success: boolean;
    message?: string;
    data?: any | null;
}

