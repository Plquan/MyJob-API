export interface ICreateCheckoutSessionRequest {
    packageId: number;
    companyId?: number;
    successUrl: string;
    cancelUrl: string;
}

export interface ICreateCheckoutSessionResponse {
    sessionId: string;
    url: string;
}

export interface IPaymentWebhookEvent {
    id: string;
    type: string;
    data: {
        object: any;
    };
}

export interface IPaymentHistoryDto {
    id: number;
    companyId: number;
    packageId: number;
    price: number;
    paymentMethod?: string;
    paymentDate?: Date;
    startDate?: Date;
    endDate: Date;
    company: {
        id: number;
        companyName: string;
        companyEmail: string;
        companyPhone: string;
        taxCode: string;
        address: string;
    };
    package: {
        id: number;
        name: string;
        description?: string;
    };
}

export default interface IPaymentService {
    createCheckoutSession(data: ICreateCheckoutSessionRequest): Promise<ICreateCheckoutSessionResponse>;
    constructWebhookEvent(payload: string | Buffer, signature: string): IPaymentWebhookEvent;
    handlePaymentSuccess(sessionId: string): Promise<void>;
    handlePaymentFailed(sessionId: string): Promise<void>;
    getPaymentHistory(): Promise<IPaymentHistoryDto[]>;
}

