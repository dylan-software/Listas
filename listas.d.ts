declare enum OrderStatus {
    Requested = "Requested",
    InQuote = "In quote",
    Approved = "Approved",
    InPreparation = "In preparation",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Paid = "Paid",
    Rejected = "Rejected"
}
declare class Order {
    id: string;
    customer: string;
    product: string;
    quantity: number;
    status: OrderStatus;
    constructor(id: string, customer: string, product: string, quantity: number, status?: OrderStatus);
}
declare class OrderManagement {
    private maxCapacity;
    private orders;
    constructor(maxCapacity: number);
    searchOrder(id: string): number;
    addOrder(order: Order): void;
    deleteOrder(id: string): void;
    updateOrder(id: string, orderNew: Order): void;
    updateOrderStatus(id: string, newStatus: OrderStatus): void;
    getAvailableQuantity(): number;
    listOrders(): Order[];
}
declare const MAX_CAPACITY = 10;
declare const orderManagement: OrderManagement;
declare const form: HTMLFormElement;
declare const inputId: HTMLInputElement;
declare const inputCustomer: HTMLInputElement;
declare const inputProduct: HTMLInputElement;
declare const inputQuantity: HTMLInputElement;
declare const inputSearch: HTMLInputElement;
declare const btnSearch: HTMLButtonElement;
declare const tableBody: HTMLTableSectionElement;
declare const capacityText: HTMLParagraphElement;
declare const message: HTMLDivElement;
declare const orderedStatuses: OrderStatus[];
declare function showMessage(text: string, type: "ok" | "error"): void;
declare function createStatusSelect(order: Order): HTMLSelectElement;
declare function badgeClass(status: OrderStatus): string;
declare function renderTable(): void;
//# sourceMappingURL=listas.d.ts.map