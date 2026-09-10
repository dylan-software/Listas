declare enum OrderStatus {
    Requested = "Solicitado",
    InQuote = "En cotizaci\u00F3n",
    Approved = "Aprobado",
    InPreparation = "En preparaci\u00F3n",
    Shipped = "Enviado",
    Delivered = "Entregado",
    Paid = "Pagado",
    Rejected = "Rechazado"
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
declare const inputCliente: HTMLInputElement;
declare const inputProducto: HTMLInputElement;
declare const inputCantidad: HTMLInputElement;
declare const inputBuscar: HTMLInputElement;
declare const btnBuscar: HTMLButtonElement;
declare const tablaBody: HTMLTableSectionElement;
declare const capacidadTexto: HTMLParagraphElement;
declare const mensaje: HTMLDivElement;
declare const orderedStatuses: OrderStatus[];
declare function showMessage(text: string, type: "ok" | "error"): void;
declare function createStatusSelect(order: Order): HTMLSelectElement;
declare function badgeClass(status: OrderStatus): string;
declare function renderTable(): void;
//# sourceMappingURL=listas.d.ts.map