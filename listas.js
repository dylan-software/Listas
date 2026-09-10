"use strict";
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Requested"] = "Requested";
    OrderStatus["InQuote"] = "In quote";
    OrderStatus["Approved"] = "Approved";
    OrderStatus["InPreparation"] = "In preparation";
    OrderStatus["Shipped"] = "Shipped";
    OrderStatus["Delivered"] = "Delivered";
    OrderStatus["Paid"] = "Paid";
    OrderStatus["Rejected"] = "Rejected";
})(OrderStatus || (OrderStatus = {}));
// Equivalent to the "Car" class from the parking lot example.
class Order {
    id;
    customer;
    product;
    quantity;
    status;
    constructor(id, customer, product, quantity, status = OrderStatus.Requested) {
        this.id = id;
        this.customer = customer;
        this.product = product;
        this.quantity = quantity;
        this.status = status;
    }
}
// Equivalent to the "Parking" class shown in class.
class OrderManagement {
    maxCapacity;
    orders = [];
    constructor(maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    // Same as searchCar(plate): finds by id and returns the index.
    searchOrder(id) {
        return this.orders.findIndex((o) => o.id === id);
    }
    // Same as addCar(car): adds if there is room in the list.
    addOrder(order) {
        if (this.searchOrder(order.id) !== -1) {
            console.error("An order with that ID already exists");
            return;
        }
        if (this.orders.length < this.maxCapacity) {
            this.orders.push(order);
        }
        else {
            console.error("Maximum order capacity reached");
        }
    }
    // Same as deleteCar(plate): removes by id using splice.
    deleteOrder(id) {
        const orderIndex = this.searchOrder(id);
        if (orderIndex !== -1) {
            this.orders.splice(orderIndex, 1);
        }
        else {
            console.error("Order not found");
        }
    }
    // Same as updateCar(plate, carNew): replaces the full record.
    updateOrder(id, orderNew) {
        const orderIndex = this.searchOrder(id);
        if (orderIndex !== -1) {
            this.orders[orderIndex] = orderNew;
        }
        else {
            console.error("Order not found");
        }
    }
    // Additional method to move the order along the process
    // flow diagram (request -> ... -> payment).
    updateOrderStatus(id, newStatus) {
        const orderIndex = this.searchOrder(id);
        if (orderIndex !== -1 && this.orders[orderIndex]) {
            this.orders[orderIndex].status = newStatus;
        }
        else {
            console.error("Order not found");
        }
    }
    // Same as getQuantitySpacesAvailable(): remaining room in the list.
    getAvailableQuantity() {
        return this.maxCapacity - this.orders.length;
    }
    // Same as listCarsParked(): returns the full list.
    listOrders() {
        return this.orders;
    }
}
// =========================================================
// User interface: connects the OrderManagement class (the
// list) with the HTML. Everything below is DOM handling.
// =========================================================
const MAX_CAPACITY = 10;
const orderManagement = new OrderManagement(MAX_CAPACITY);
const form = document.getElementById("order-form");
const inputId = document.getElementById("input-id");
const inputCustomer = document.getElementById("input-customer");
const inputProduct = document.getElementById("input-product");
const inputQuantity = document.getElementById("input-quantity");
const inputSearch = document.getElementById("input-search");
const btnSearch = document.getElementById("btn-search");
const tableBody = document.getElementById("orders-table-body");
const capacityText = document.getElementById("capacity-text");
const message = document.getElementById("message");
const orderedStatuses = [
    OrderStatus.Requested,
    OrderStatus.InQuote,
    OrderStatus.Approved,
    OrderStatus.InPreparation,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Paid,
    OrderStatus.Rejected,
];
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message message--${type}`;
    message.classList.remove("hidden");
    window.setTimeout(() => message.classList.add("hidden"), 2600);
}
function createStatusSelect(order) {
    const select = document.createElement("select");
    select.className = "status-select";
    orderedStatuses.forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (status === order.status)
            option.selected = true;
        select.appendChild(option);
    });
    select.addEventListener("change", () => {
        orderManagement.updateOrderStatus(order.id, select.value);
        renderTable();
        showMessage(`Order ${order.id} updated to "${select.value}"`, "ok");
    });
    return select;
}
function badgeClass(status) {
    switch (status) {
        case OrderStatus.Paid:
        case OrderStatus.Delivered:
            return "badge badge--success";
        case OrderStatus.Rejected:
            return "badge badge--error";
        case OrderStatus.Requested:
        case OrderStatus.InQuote:
            return "badge badge--pending";
        default:
            return "badge badge--in-progress";
    }
}
function renderTable() {
    const orders = orderManagement.listOrders();
    tableBody.innerHTML = "";
    if (orders.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6" class="empty-row">No orders registered yet.</td>`;
        tableBody.appendChild(row);
    }
    orders.forEach((order) => {
        const row = document.createElement("tr");
        const tdId = document.createElement("td");
        tdId.textContent = order.id;
        const tdCustomer = document.createElement("td");
        tdCustomer.textContent = order.customer;
        const tdProduct = document.createElement("td");
        tdProduct.textContent = `${order.product} (x${order.quantity})`;
        const tdStatus = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = badgeClass(order.status);
        badge.textContent = order.status;
        tdStatus.appendChild(badge);
        const tdChangeStatus = document.createElement("td");
        tdChangeStatus.appendChild(createStatusSelect(order));
        const tdActions = document.createElement("td");
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-delete";
        btnDelete.textContent = "Delete";
        btnDelete.addEventListener("click", () => {
            orderManagement.deleteOrder(order.id);
            renderTable();
            showMessage(`Order ${order.id} deleted`, "ok");
        });
        tdActions.appendChild(btnDelete);
        row.append(tdId, tdCustomer, tdProduct, tdStatus, tdChangeStatus, tdActions);
        tableBody.appendChild(row);
    });
    capacityText.textContent = `Available slots: ${orderManagement.getAvailableQuantity()} of ${MAX_CAPACITY}`;
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = inputId.value.trim();
    const customer = inputCustomer.value.trim();
    const product = inputProduct.value.trim();
    const quantity = Number(inputQuantity.value);
    if (!id || !customer || !product || !quantity || quantity <= 0) {
        showMessage("Fill in all fields with valid values", "error");
        return;
    }
    if (orderManagement.searchOrder(id) !== -1) {
        showMessage(`An order with ID "${id}" already exists`, "error");
        return;
    }
    if (orderManagement.getAvailableQuantity() <= 0) {
        showMessage("No slots available for more orders", "error");
        return;
    }
    const newOrder = new Order(id, customer, product, quantity);
    orderManagement.addOrder(newOrder);
    renderTable();
    showMessage(`Order ${id} added successfully`, "ok");
    form.reset();
    inputId.focus();
});
btnSearch.addEventListener("click", () => {
    const id = inputSearch.value.trim();
    if (!id)
        return;
    const index = orderManagement.searchOrder(id);
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.forEach((row) => row.classList.remove("highlighted-row"));
    if (index === -1) {
        showMessage(`No order found with ID "${id}"`, "error");
        return;
    }
    const foundRow = rows[index];
    if (foundRow) {
        foundRow.classList.add("highlighted-row");
        foundRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    showMessage(`Order ${id} found at position ${index} in the list`, "ok");
});
// Sample data so the table doesn't start empty,
// just like the Parking class example with carMazda,
// carFord, carChevrolet, etc.
orderManagement.addOrder(new Order("P-001", "Laura Gomez", "Mechanical keyboard", 1, OrderStatus.Requested));
orderManagement.addOrder(new Order("P-002", "Carlos Ruiz", "24\" Monitor", 2, OrderStatus.InQuote));
orderManagement.addOrder(new Order("P-003", "Ana Torres", "Wireless mouse", 3, OrderStatus.InPreparation));
orderManagement.addOrder(new Order("P-004", "Diego Pena", "Ergonomic chair", 1, OrderStatus.Delivered));
renderTable();
//# sourceMappingURL=listas.js.map