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

export default interface IPaymentService {
    createCheckoutSession(data: ICreateCheckoutSessionRequest): Promise<ICreateCheckoutSessionResponse>;
    constructWebhookEvent(payload: string | Buffer, signature: string): IPaymentWebhookEvent;
    handlePaymentSuccess(sessionId: string): Promise<void>;
    handlePaymentFailed(sessionId: string): Promise<void>;
}

